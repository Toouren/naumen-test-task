import * as queryString from 'query-string';

import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { IWikiResponse, ISearchRequest, IWikiRequest, IUrl } from '../types';

const staticQueryParamsString = queryString.stringify({
  origin: '*',
  action: 'query',
  list: 'search',
  utf8: '',
  format: 'json'
});

const STATIC_PART_OF_API_URL = 'w/api.php?';
const MAIN_WIKI_URL_PART = {
  ru: 'https://ru.wikipedia.org/',
  en: 'https://en.wikipedia.org/'
};

@Injectable()
export class WikiapiWorkerService {
  private wikiResponseArray = new WikiResponseArray();
  private searchArchive = new SearchArchive();
  private srsort = 'relevance';

  public getJsonSuccessEvent: EventEmitter<IWikiResponse[]> = new EventEmitter();
  public getJsonErrorEvent: EventEmitter<IWikiResponse[]> = new EventEmitter();
  public getJsonEmptyEvent: EventEmitter<IWikiResponse[]> = new EventEmitter();
  public archiveChangedEvent: EventEmitter<ISearchRequest[]> = new EventEmitter();

  constructor(private httpClient: HttpClient) { }

  public setSrsort(value: string) {
    this.srsort = value;
  }

  private buildSearchUrlString(locale: string, request: string, sroffset: number, srlimit: number): string {
    const dinamicQueryParamsString = queryString.stringify({
      srsearch: request,
      srlimit,
      sroffset,
      srsort: this.srsort
    });
    const url = `${MAIN_WIKI_URL_PART[locale]}${STATIC_PART_OF_API_URL}
                  ${staticQueryParamsString}${dinamicQueryParamsString}`;
    return url;
  }

  private buildSearchUrlObject(locale?: string, request?: string, sroffset?: number, srlimit?: number): IUrl {
    const lastSearchRequst: ISearchRequest = this.searchArchive.getLastRequest();
    srlimit = srlimit || 10;
    request = (typeof request !== 'undefined') ? request : lastSearchRequst.request;
    locale = locale || lastSearchRequst.locale;

    if (sroffset) {
      this.wikiResponseArray.setSroffsetFlag(true);
    } else {
      sroffset = 0;
      this.wikiResponseArray.setSroffsetFlag(false);
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
            if (this.searchArchive.pushRequestToSearchArchive(url)) {
              this.emiteArchiveChangedEvent();
            }
            this.emitGetJsonEvent(res);
          },
          (error: HttpErrorResponse) => {
            this.emitGetJsonEvent(this.formErrorWikiRequest(error));
          });
  }

  private emiteArchiveChangedEvent() {
    this.archiveChangedEvent.emit(Array.from(this.searchArchive.getArchive()));
  }

  private emitGetJsonEvent(response: IWikiResponse) {
    this.wikiResponseArray.setResponseArray(response);
    this.wikiResponseArray.getLastResponse().error ?
    this.getJsonErrorEvent.emit(Array.from(this.wikiResponseArray.getResponseArray())) :
    this.wikiResponseArray.getLastResponse().query.searchinfo.totalhits === 0 ?
    this.getJsonEmptyEvent.emit(Array.from(this.wikiResponseArray.getResponseArray())) :
    (
      this.wikiResponseArray.setLinksForFoundBlocksOfLastResponse(this.searchArchive.getLastRequest().locale),
      this.getJsonSuccessEvent.emit(Array.from(this.wikiResponseArray.getResponseArray()))
    );
  }

}

class SearchArchive {
  constructor(private archive: ISearchRequest[] = []) {}

  public getArchive() {
    return this.archive;
  }

  public getLastRequest(): ISearchRequest {
    return this.archive[this.archive.length - 1];
  }

  private unValidRequest(searchRequest: ISearchRequest): boolean {
    const lastSearchRequst: ISearchRequest = this.getLastRequest();
    return searchRequest.request === '' ||
        (typeof lastSearchRequst !== 'undefined' &&
        lastSearchRequst.locale === searchRequest.locale &&
        lastSearchRequst.request === searchRequest.request);
  }

  public pushRequestToSearchArchive(url: IUrl): boolean {
    const searchRequest: ISearchRequest = {
      request: url.request,
      locale: url.locale
    };

    if (this.unValidRequest(searchRequest)) {
      return false;
    } else {
      if (this.archive.length >= 10) {
        this.archive.splice(0, 1);
      }
      this.archive.push(searchRequest);
      return true;
    }
  }
}

class WikiResponseArray {
  constructor(private responseArray: IWikiResponse[] = [], private sroffsetFlag = false) {}

  public getResponseArray() {
    return this.responseArray;
  }

  public setSroffsetFlag(value: boolean) {
    this.sroffsetFlag = value;
  }

  public setResponseArray(response: IWikiResponse) {
    this.sroffsetFlag ? this.responseArray.push(response) :
    this.responseArray.splice(0, this.responseArray.length, response);
  }

  public getLastResponse(): IWikiResponse {
    return this.responseArray[this.responseArray.length - 1];
  }

  public setLinksForFoundBlocksOfLastResponse(locale: string) {
    const lastResponse = this.getLastResponse();
    lastResponse
      .query
      .search
      .forEach(foundBlock => {
        foundBlock.linkToPage = `${MAIN_WIKI_URL_PART[locale]}wiki/${foundBlock.title}`;
      });
  }
}
