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
  totalhits = 0;
  averageWordNumber = 0;
  showClassForSettingsComp = 'hide-block';

  constructor(private wikiapiWorkerService: WikiapiWorkerService) {
    this.wikiapiWorkerService
        .getJsonSuccessEvent
        .subscribe(
          (data: IWikiResponse[]) => this.renderPageUpdatedData(data, true, false));
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

  setLoadMoreFlag(flag?: boolean) {
    typeof flag !== 'undefined' ? this.loadMore = flag :
    typeof this.getLastResponse().continue !== 'undefined' ? this.loadMore = true :
    this.loadMore = false;
  }

  setTotalhits() {
    this.getLastResponse().query ? this.totalhits = this.getLastResponse().query.searchinfo.totalhits :
    this.totalhits = 0;
  }

  getAverageWordNumber() {
    const numberOfFoundBlocks = this.arrayOfResponse.length * this.getLastResponse().query.search.length;
    return this.arrayOfResponse.reduce<number>((sumOfWordsInResponse, response) => {
      return sumOfWordsInResponse += response.query.search.reduce<number>((sumOfWordsInFoundBlock, foundBlock) => {
        return sumOfWordsInFoundBlock += foundBlock.wordcount;
      }, 0);
    }, 0) / numberOfFoundBlocks;
  }

  setAverageWordNumber() {
    this.getLastResponse().query ? this.averageWordNumber = Math.floor(this.getAverageWordNumber()) :
    this.averageWordNumber = 0;

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
      }, 1000);
    });
  }

  setArrayOfResponsePromise(data: IWikiResponse[]) {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise((resolve) => {
      setTimeout(() => {
        this.setData(data);
        resolve();
      }, 0);
    });
  }

  setLoadMoreFlagPromise(value?: boolean) {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise((resolve) => {
      setTimeout(() => {
        this.setLoadMoreFlag(value);
        resolve();
      }, 0);
    });
  }

  setSearchInfoValuesPromise() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.setTotalhits();
        this.setAverageWordNumber();
        resolve();
      }, 0);
    });
  }

  setFlags(successResponseFlag: boolean, emptyResponseFlag: boolean) {
    this.successResponse = successResponseFlag;
    this.emptyResponse = emptyResponseFlag;
  }

  setData(arrayOfResponse: IWikiResponse[]) {
    this.arrayOfResponse = arrayOfResponse;
  }

  renderPageUpdatedData(data: IWikiResponse[], successResponseFlag: boolean, emptyResponseFlag: boolean) {
    Promise.resolve()
      .then(() => {
        return this.setAlignPromise('100vw', 0);
      })
      .then(() => {
        return this.setLoadMoreFlagPromise(false);
      })
      .then(() => {
        return this.setFlagsPromise(successResponseFlag, emptyResponseFlag);
      })
      .then(() => {
        return this.setArrayOfResponsePromise(data);
      })
      .then(() => {
        return this.setLoadMoreFlagPromise();
      })
      .then(() => {
        return this.setSearchInfoValuesPromise();
      })
      .then(() => {
        return this.setAlignPromise('0', 500);
      });
  }

  getMoreData() {
    const wikiRequest: IWikiRequest = {
      sroffset: this.getLastResponse().continue.sroffset
    };
    this.wikiapiWorkerService.getJsonForSearchRequest(wikiRequest);
  }

  enteredOnBlock() {
    this.showClassForSettingsComp = 'show-block';
  }

  leaveBlock() {
    this.showClassForSettingsComp = 'hide-block';
  }
}
