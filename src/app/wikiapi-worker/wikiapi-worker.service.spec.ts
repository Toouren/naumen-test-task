import { TestBed } from '@angular/core/testing';

import { WikiapiWorkerService } from './wikiapi-worker.service';
import { HttpHandler, HttpClient } from '@angular/common/http';
import { ISearchRequest } from '../types';

describe('WikiapiWorkerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ WikiapiWorkerService, HttpClient, HttpHandler]
  }));

  let service: WikiapiWorkerService;
  let mockFirstValidSearchRequest: ISearchRequest;
  let mockSecondValidSearchRequest: ISearchRequest;
  let mockEmptySearchRequest: ISearchRequest;

  beforeEach(() => {
    service = TestBed.get(WikiapiWorkerService);
    mockFirstValidSearchRequest = {
      request: 'test1',
      locale: 'ru'
    };
    mockSecondValidSearchRequest = {
      request: 'test2',
      locale: 'ru'
    };
    mockEmptySearchRequest = {
      request: '',
      locale: 'ru'
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
