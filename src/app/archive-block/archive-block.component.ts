import { Component } from '@angular/core';
import { WikiapiWorkerService } from '../wikiapi-worker/wikiapi-worker.service';
import { ISearchRequest, IWikiRequest } from '../types';

@Component({
  selector: 'app-archive-block',
  templateUrl: './archive-block.component.html',
  styleUrls: ['./archive-block.component.css']
})
export class ArchiveBlockComponent {

  searchArchive: ISearchRequest[] = [];
  showClass = 'hide-block';
  constructor(private wikiapiWorkerService: WikiapiWorkerService) {
    this.wikiapiWorkerService.archiveChangedEvent.subscribe(
      (searchArchive: ISearchRequest[]) => this.searchArchive = searchArchive);
  }

  makeRequestToWiki(request: string, locale: string) {
    const wikiRequest: IWikiRequest = {
      locale,
      request
    };
    this.wikiapiWorkerService.getJsonForSearchRequest(wikiRequest);
  }

  enteredOnBlock() {
    this.showClass = 'show-block';
  }

  leaveBlock() {
    this.showClass = 'hide-block';
  }
}
