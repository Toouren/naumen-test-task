import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { InputFormComponent } from './input-form/input-form.component';
import { HttpClientModule } from '@angular/common/http';
import { WikiapiWorkerService } from './wikiapi-worker/wikiapi-worker.service';
import { WikiBlockComponent } from './wiki-block/wiki-block.component';
import { ArchiveBlockComponent } from './archive-block/archive-block.component';

@NgModule({
  declarations: [
    AppComponent,
    InputFormComponent,
    WikiBlockComponent,
    ArchiveBlockComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [WikiapiWorkerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
