import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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

  constructor() { }
}
