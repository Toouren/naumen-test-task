import { Component, Input, Output, EventEmitter } from '@angular/core';
import { WikiapiWorkerService } from 'src/app/wikiapi-worker/wikiapi-worker.service';

@Component({
  selector: 'app-settings-block',
  templateUrl: './settings-block.component.html',
  styleUrls: ['./settings-block.component.css']
})
export class SettingsBlockComponent {

  @Input()
  totalhits: number;
  @Input()
  averageWordNumber: number;
  @Input()
  showBlock: string;
  @Output()
  changedSortEvent: EventEmitter<string> = new EventEmitter();

  private currentSortType = 'relevance';
  private sortOptions = [
    {
      value: 'relevance',
      name: 'По релевантности'
    },
    {
      value: 'last_edit_asc',
      name: 'По дате изменения (старые-новые)'
    },
    {
      value: 'last_edit_desc',
      name: 'По дате изменения (новые-старые)'
    }
  ];

  private disabled = true;

  constructor(private wikiapiWorkerService: WikiapiWorkerService) { }

  selectChanged(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    selectedValue !== this.currentSortType ? this.disabled = false : this.disabled = true;
  }

  acceptSetting(newValue: string) {
    this.currentSortType = newValue;
    this.disabled = true;
    this.wikiapiWorkerService.setSrsort(this.currentSortType);
  }
}
