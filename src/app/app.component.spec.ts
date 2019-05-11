import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { WikiBlockComponent } from './wiki-block/wiki-block.component';
import { InputFormComponent } from './input-form/input-form.component';
import { SettingsBlockComponent } from './wiki-block/settings-block/settings-block.component';
import { ArchiveBlockComponent } from './archive-block/archive-block.component';
import { WikiapiWorkerService } from './wikiapi-worker/wikiapi-worker.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        InputFormComponent,
        WikiBlockComponent,
        ArchiveBlockComponent,
        SettingsBlockComponent
      ],
      providers: [WikiapiWorkerService, HttpClient, HttpHandler]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
