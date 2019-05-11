import { TestBed } from '@angular/core/testing';

import { WikiapiWorkerService } from './wikiapi-worker.service';
import { HttpHandler, HttpClient } from '@angular/common/http';

describe('WikiapiWorkerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ WikiapiWorkerService, HttpClient, HttpHandler]
  }));

  let service: WikiapiWorkerService;

  beforeEach(() => {
    service = TestBed.get(WikiapiWorkerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
