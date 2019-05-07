import { Component, OnInit } from '@angular/core';
import { WikiapiWorkerService } from '../wikiapi-worker/wikiapi-worker.service';
import { ISearchRequest, IWikiRequest } from '../types';

@Component({
  selector: 'app-archive-block',
  templateUrl: './archive-block.component.html',
  styleUrls: ['./archive-block.component.css']
})
export class ArchiveBlockComponent implements OnInit {

  searchArchive: ISearchRequest[] = [];
  showClass = 'hide-block';
  constructor(private wikiapiWorkerService: WikiapiWorkerService) {
    this.wikiapiWorkerService.archiveChangedEvent.subscribe(
      (searchArchive: ISearchRequest[]) => this.searchArchive = searchArchive);
  }

  ngOnInit() {
  }

  makeRequestToWiki(request: string, locale: string) {
    const wikiRequest: IWikiRequest = {
      locale,
      request
    };
    this.wikiapiWorkerService.getJson(wikiRequest);
  }

  enteredOnBlock() {
    console.log('entered');
    this.showClass = 'show-block';
  }

  leaveBlock() {
    console.log('leave');
    this.showClass = 'hide-block';
  }
}
