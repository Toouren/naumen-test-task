import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsBlockComponent } from './settings-block.component';

describe('SettingsBlockComponent', () => {
  let component: SettingsBlockComponent;
  let fixture: ComponentFixture<SettingsBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
