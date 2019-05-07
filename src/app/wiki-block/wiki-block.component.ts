import { Component, OnInit, Input } from '@angular/core';
import { WikiapiWorkerService } from '../wikiapi-worker/wikiapi-worker.service';

import { IWikiResponse, IWikiRequest } from '../types';

@Component({
  selector: 'app-wiki-block',
  templateUrl: './wiki-block.component.html',
  styleUrls: ['./wiki-block.component.css']
})
export class WikiBlockComponent implements OnInit {

  @Input()
  dataObject: IWikiResponse;
  successResponse = true;
  emptyResponse = false;
  loadMore = false;
  leftAlignValue: string;

  constructor(private wikiapiWorkerService: WikiapiWorkerService) {
    this.wikiapiWorkerService
        .getJsonSuccessEvent
        .subscribe(
          (data: IWikiResponse) => this.renderPageUpdatedData(data, true, false)
        );
    this.wikiapiWorkerService
        .getJsonErrorEvent
        .subscribe(
          (data: IWikiResponse) => this.renderPageUpdatedData(data, false, false)
        );
    this.wikiapiWorkerService
        .getJsonEmptyEvent
        .subscribe(
          (data: IWikiResponse) => this.renderPageUpdatedData(data, false, true)
        );
   }

  ngOnInit() {
  }

  setAlignValueAsync(value: string, timout = 0) {
    setTimeout(() => this.leftAlignValue = value, timout);
  }

  setLoadMoreFlag() {
    if (typeof this.dataObject.continue !== 'undefined') {
      this.loadMore = true;
      return;
    }
    this.loadMore = false;
  }

  renderPageUpdatedData(data: IWikiResponse, successResponseFlag: boolean, emptyResponseFlag: boolean) {
    this.setAlignValueAsync('100vw');
    setTimeout(() => {
      this.successResponse = successResponseFlag;
      this.emptyResponse = emptyResponseFlag;
    }, 500);
    setTimeout(() => {
      this.dataObject = data;
      this.setLoadMoreFlag();
    }, 1000);
    this.setAlignValueAsync('0', 1500);
  }

  getMoreData() {
    const wikiRequest: IWikiRequest = {
      sroffset: this.dataObject.continue.sroffset
    };
    this.wikiapiWorkerService.getJson(wikiRequest);
  }
}
