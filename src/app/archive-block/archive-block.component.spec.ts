import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveBlockComponent } from './archive-block.component';

describe('ArchiveBlockComponent', () => {
  let component: ArchiveBlockComponent;
  let fixture: ComponentFixture<ArchiveBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchiveBlockComponent ]
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
