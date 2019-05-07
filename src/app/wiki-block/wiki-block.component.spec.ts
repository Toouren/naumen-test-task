import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WikiBlockComponent } from './wiki-block.component';

describe('WikiBlockComponent', () => {
  let component: WikiBlockComponent;
  let fixture: ComponentFixture<WikiBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WikiBlockComponent ]
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
