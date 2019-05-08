import { Component, OnInit } from '@angular/core';
import { WikiapiWorkerService } from '../wikiapi-worker/wikiapi-worker.service';

import { IWikiResponse, IWikiRequest } from '../types';

@Component({
  selector: 'app-wiki-block',
  templateUrl: './wiki-block.component.html',
  styleUrls: ['./wiki-block.component.css']
})
export class WikiBlockComponent implements OnInit {

  arrayOfResponse: IWikiResponse[] = [];
  successResponse = true;
  emptyResponse = false;
  loadMore = false;
  leftAlignValue: string;

  constructor(private wikiapiWorkerService: WikiapiWorkerService) {
    this.wikiapiWorkerService
        .getJsonSuccessEvent
        .subscribe(
          (data: IWikiResponse[]) => {
            console.log(`event`);
            this.renderPageUpdatedData(data, true, false);
        });
    this.wikiapiWorkerService
        .getJsonErrorEvent
        .subscribe(
          (data: IWikiResponse[]) => this.renderPageUpdatedData(data, false, false)
        );
    this.wikiapiWorkerService
        .getJsonEmptyEvent
        .subscribe(
          (data: IWikiResponse[]) => this.renderPageUpdatedData(data, false, true)
        );
   }

  ngOnInit() {
  }

  setAlignValueAsync(value: string, timout = 0) {
    setTimeout(() => this.leftAlignValue = value, timout);
  }

  setAlignValue(value: string) {
    this.leftAlignValue = value;
  }

  getLastResponse(): IWikiResponse {
    return this.arrayOfResponse[this.arrayOfResponse.length - 1];
  }

  setLoadMoreFlag() {
    if (typeof this.getLastResponse().continue !== 'undefined') {
      this.loadMore = true;
      return;
    }
    this.loadMore = false;
  }

  setAlignPromise(value: string, timout: number) {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise((resolve) => {
      setTimeout(() => {
        this.setAlignValue(value);
        resolve();
      }, timout);
    });
  }

  setFlagsPromise(successResponseFlag: boolean, emptyResponseFlag: boolean) {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise((resolve) => {
      setTimeout(() => {
        this.setFlags(successResponseFlag, emptyResponseFlag);
        resolve();
      }, 0);
    });
  }

  setArrayOfResponsePromise(data: IWikiResponse[]) {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise((resolve) => {
      setTimeout(() => {
        this.setData(data);
        resolve();
      }, 1000);
    });
  }

  setLoadMoreFlagPromise() {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise((resolve) => {
      setTimeout(() => {
        this.setLoadMoreFlag();
        resolve();
      }, 0);
    });
  }

  setFlags(successResponseFlag: boolean, emptyResponseFlag: boolean) {
    this.successResponse = successResponseFlag;
    this.emptyResponse = emptyResponseFlag;
  }

  setData(arrayOfResponse: IWikiResponse[]) {
    console.log(`in setData1: `);
    console.log(this.arrayOfResponse);
    this.arrayOfResponse = arrayOfResponse;
    console.log(`in setData2: `);
    console.log(this.arrayOfResponse);
  }

  renderPageUpdatedData(data: IWikiResponse[], successResponseFlag: boolean, emptyResponseFlag: boolean) {
    Promise.resolve()
      .then(() => {
        console.log(this.arrayOfResponse);
        return this.setAlignPromise('100vw', 0);
      })
      .then(() => {
        console.log(this.arrayOfResponse);
        return this.setFlagsPromise(successResponseFlag, emptyResponseFlag);
      })
      .then(() => {
        console.log(this.arrayOfResponse);
        return this.setArrayOfResponsePromise(data);
      })
      .then(() => {
        console.log(this.arrayOfResponse);
        return this.setLoadMoreFlagPromise();
      })
      .then(() => {
        console.log(this.arrayOfResponse);
        return this.setAlignPromise('0', 500);
      });
  }

  getMoreData() {
    const wikiRequest: IWikiRequest = {
      sroffset: this.getLastResponse().continue.sroffset
    };
    this.wikiapiWorkerService.getJson(wikiRequest);
  }
}
