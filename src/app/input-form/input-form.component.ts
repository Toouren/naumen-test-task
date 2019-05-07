import { Component, OnInit } from '@angular/core';
import { WikiapiWorkerService } from '../wikiapi-worker/wikiapi-worker.service';
import { ILocale, IWikiRequest } from '../types';

@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.css']
})
export class InputFormComponent implements OnInit {

  className = '';
  locales: ILocale[] = [
    { shortForm: 'ru', normalForm: 'Russian'},
    { shortForm: 'en', normalForm: 'English'}
  ];
  selectedLocal = 'en';

  constructor(private wikiapiWorkerService: WikiapiWorkerService) {
    this.wikiapiWorkerService.getJsonSuccessEvent.subscribe(_ => this.setSuccessClassName());
    this.wikiapiWorkerService.getJsonErrorEvent.subscribe(_ => this.setErrorClassName());
    this.wikiapiWorkerService.getJsonEmptyEvent.subscribe(_ => this.setErrorClassName());
   }

  ngOnInit() {
  }

  makeRequestToWiki(request: string) {
    const wikiRequest: IWikiRequest = {
      locale: this.selectedLocal,
      request
    };
    this.wikiapiWorkerService.getJson(wikiRequest);
  }

  localeChangeHandler(event: Event) {
    this.selectedLocal = (event.target as HTMLInputElement).value;
  }

  setSuccessClassName() {
    this.className = 'success';
  }

  setErrorClassName() {
    this.className = '';
  }
}
