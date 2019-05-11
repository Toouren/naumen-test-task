import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WikiapiWorkerService } from '../wikiapi-worker/wikiapi-worker.service';

import { ArchiveBlockComponent } from './archive-block.component';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('ArchiveBlockComponent', () => {
  let component: ArchiveBlockComponent;
  let fixture: ComponentFixture<ArchiveBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchiveBlockComponent ],
      providers: [ WikiapiWorkerService, HttpHandler, HttpClient ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
