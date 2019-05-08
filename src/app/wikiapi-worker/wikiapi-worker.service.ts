import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { IWikiResponse, ISearchRequest, IWikiRequest, IUrl } from '../types';

@Injectable()
export class WikiapiWorkerService {
  private STATIC_PART_OF_QUERY_URL = 'origin=*&action=query';
  private STATIC_PART_OF_SEARCH_URL = 'list=search&utf8=&format=json';
  private STATIC_PART_OF_API_URL = 'w/api.php?';
  private MAIN_WIKI_URL_PART = {
    ru: 'https://ru.wikipedia.org/',
    en: 'https://en.wikipedia.org/'
  };
  private wikiResponseArray: IWikiResponse[] = [];
  private searchArchive: ISearchRequest[] = [];
  private sroffsetFlag = false;

  public getJsonSuccessEvent: EventEmitter<IWikiResponse[]> = new EventEmitter();
  public getJsonErrorEvent: EventEmitter<IWikiResponse[]> = new EventEmitter();
  public getJsonEmptyEvent: EventEmitter<IWikiResponse[]> = new EventEmitter();
  public archiveChangedEvent: EventEmitter<ISearchRequest[]> = new EventEmitter();

  constructor(private httpClient: HttpClient) { }

  private validRequest(searchRequest: ISearchRequest): boolean {
    const lastSearchRequst: ISearchRequest = this.searchArchive[this.searchArchive.length - 1];
    return searchRequest.request === '' ||
        (typeof lastSearchRequst !== 'undefined' &&
        lastSearchRequst.locale === searchRequest.locale &&
        lastSearchRequst.request === searchRequest.request);
  }

  private pushRequestToSearchArchive(url: IUrl) {
    const searchRequest: ISearchRequest = {
      request: url.request,
      locale: url.locale
    };

    if (this.validRequest(searchRequest)) {
      return;
    } else {
      if (this.searchArchive.length >= 10) {
        this.searchArchive.splice(0, 1);
      }
      this.searchArchive.push(searchRequest);
      this.emiteArchiveChangedEvent();
    }
  }

  private getLastRequest(): ISearchRequest {
    return this.searchArchive[this.searchArchive.length - 1];
  }

  private buildSearchUrlString(locale: string, request: string, sroffset: number, srlimit: number): string {
    const url = `${this.MAIN_WIKI_URL_PART[locale]}${this.STATIC_PART_OF_API_URL}
                srsearch=${request}&
                srlimit=${srlimit}&
                sroffset=${sroffset}&
                ${this.STATIC_PART_OF_QUERY_URL}&
                ${this.STATIC_PART_OF_SEARCH_URL}`;
    return url;
  }

  private buildSearchUrlObject(locale?: string, request?: string, sroffset?: number, srlimit?: number): IUrl {
    const lastSearchRequst: ISearchRequest = this.getLastRequest();
    srlimit = srlimit || 10;
    request = (typeof request !== 'undefined') ? request : lastSearchRequst.request;
    locale = locale || lastSearchRequst.locale;

    if (sroffset) {
      this.sroffsetFlag = true;
    } else {
      sroffset = 0;
      this.sroffsetFlag = false;
    }
    const url = this.buildSearchUrlString(locale, request, sroffset, srlimit);
    const newUrlObject = {
      urlString: url,
      request,
      locale
    };
    return newUrlObject;
  }

  private formErrorWikiRequest(error: HttpErrorResponse): IWikiResponse {
    const errorWikiRequest = { error: {
      code: error.statusText, info: error.message }
    };
    return errorWikiRequest;
  }

  public getJsonForSearchRequest(wikiRequest: IWikiRequest) {
    const { locale, request, sroffset, srlimit } = wikiRequest;
    const url = this.buildSearchUrlObject(locale, request, sroffset, srlimit);
    this.httpClient
        .get(url.urlString)
        .subscribe(
          (res: IWikiResponse) => {
            this.pushRequestToSearchArchive(url);
            this.emitGetJsonEvent(res);
          },
          (error: HttpErrorResponse) => {
            this.emitGetJsonEvent(this.formErrorWikiRequest(error));
          });
  }

  private emiteArchiveChangedEvent() {
    this.archiveChangedEvent.emit(this.searchArchive);
  }

  private setWikiResponseArray(response: IWikiResponse) {
    this.sroffsetFlag ? this.wikiResponseArray.push(response) :
    this.wikiResponseArray.splice(0, this.wikiResponseArray.length, response);
  }

  private getLastResponse(): IWikiResponse {
    return this.wikiResponseArray[this.wikiResponseArray.length - 1];
  }

  private setLinksForFoundBlocksOfLastResponse() {
    const lastResponse = this.getLastResponse();
    lastResponse
      .query
      .search
      .forEach(foundBlock => {
        foundBlock.linkToPage = `${this.MAIN_WIKI_URL_PART[this.getLastRequest().locale]}wiki/${foundBlock.title}`;
      });
  }

  private emitGetJsonEvent(response: IWikiResponse) {
    this.setWikiResponseArray(response);
    this.getLastResponse().error ? this.getJsonErrorEvent.emit(Array.from(this.wikiResponseArray)) :
    this.getLastResponse().query.searchinfo.totalhits === 0 ? this.getJsonEmptyEvent.emit(Array.from(this.wikiResponseArray)) :
    (
      this.setLinksForFoundBlocksOfLastResponse(),
      this.getJsonSuccessEvent.emit(Array.from(this.wikiResponseArray))
    );
  }

}
