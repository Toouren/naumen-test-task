import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-settings-block',
  templateUrl: './settings-block.component.html',
  styleUrls: ['./settings-block.component.css']
})
export class SettingsBlockComponent implements OnInit {

  @Input()
  totalhits: number;
  @Input()
  averageWordNumber: number;
  @Input()
  showBlock: string;

  constructor() { }

  ngOnInit() {
  }
}
