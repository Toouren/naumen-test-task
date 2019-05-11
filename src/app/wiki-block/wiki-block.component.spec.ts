import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WikiBlockComponent } from './wiki-block.component';
import { SettingsBlockComponent } from './settings-block/settings-block.component';
import { WikiapiWorkerService } from '../wikiapi-worker/wikiapi-worker.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('WikiBlockComponent', () => {
  let component: WikiBlockComponent;
  let fixture: ComponentFixture<WikiBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WikiBlockComponent, SettingsBlockComponent ],
      providers: [ WikiapiWorkerService, HttpHandler, HttpClient ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WikiBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
