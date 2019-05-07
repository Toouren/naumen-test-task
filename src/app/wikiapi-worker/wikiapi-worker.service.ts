import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { IWikiResponse, ISearchRequest, IWikiRequest, IUrl } from '../types';

@Injectable()
export class WikiapiWorkerService {
  wikiResponseObject: IWikiResponse;
  getJsonSuccessEvent: EventEmitter<IWikiResponse> = new EventEmitter();
  getJsonErrorEvent: EventEmitter<IWikiResponse> = new EventEmitter();
  getJsonEmptyEvent: EventEmitter<IWikiResponse> = new EventEmitter();
  archiveChangedEvent: EventEmitter<ISearchRequest[]> = new EventEmitter();
  searchArchive: ISearchRequest[] = [];

  constructor(private httpClient: HttpClient) { }

  pushRequestToSearchArchive(url: IUrl) {
    const searchRequest: ISearchRequest = {
      request: url.request,
      locale: url.locale
    };
    const lastSearchRequst: ISearchRequest = this.searchArchive[this.searchArchive.length - 1];
    if (typeof lastSearchRequst !== 'undefined' &&
        lastSearchRequst.locale === searchRequest.locale &&
        lastSearchRequst.request === searchRequest.request) {
      return;
    } else {
      if (this.searchArchive.length >= 10) {
        this.searchArchive.splice(0, 1);
      }
      this.searchArchive.push(searchRequest);
      this.emiteArchiveChangedEvent();
    }
  }

  formUrl(locale?: string, request?: string, sroffset?: number, srlimit?: number): IUrl {
    const lastSearchRequst: ISearchRequest = this.searchArchive[this.searchArchive.length - 1];
    srlimit = srlimit || 10;
    request = (typeof request !== 'undefined') ? request : lastSearchRequst.request;
    locale = locale || lastSearchRequst.locale;

    let url = `https://${locale}.wikipedia.org/w/api.php?
                  origin=*&
                  srlimit=${srlimit}&
                  action=query&
                  list=search&
                  srsearch=${request}&
                  utf8=&
                  format=json`;
    if (sroffset) {
      url += `&sroffset=${sroffset}`;
    }
    return {
      urlString: url,
      request,
      locale
    };
  }

  getJson(wikiRequest: IWikiRequest) {
    const { locale, request, sroffset, srlimit } = wikiRequest;
    const url = this.formUrl(locale, request, sroffset, srlimit);
    this.httpClient
        .get(url.urlString)
        .subscribe((res: IWikiResponse) => {
          this.pushRequestToSearchArchive(url);
          this.emitGetJsonEvent(res);
        });
  }

  emiteArchiveChangedEvent() {
    this.archiveChangedEvent.emit(this.searchArchive);
  }

  emitGetJsonEvent(res: IWikiResponse) {
    this.wikiResponseObject = res;
    console.log(this.wikiResponseObject);
    if (this.wikiResponseObject.error) {
      this.getJsonErrorEvent.emit(this.wikiResponseObject);
    } else {
      if (this.wikiResponseObject.query.searchinfo.totalhits === 0) {
        this.getJsonEmptyEvent.emit(this.wikiResponseObject);
      } else {
        this.getJsonSuccessEvent.emit(this.wikiResponseObject);
      }
    }
  }
}
