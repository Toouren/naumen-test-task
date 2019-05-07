import { TestBed } from '@angular/core/testing';

import { WikiapiWorkerService } from './wikiapi-worker.service';

describe('WikiapiWorkerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WikiapiWorkerService = TestBed.get(WikiapiWorkerService);
    expect(service).toBeTruthy();
  });
});
