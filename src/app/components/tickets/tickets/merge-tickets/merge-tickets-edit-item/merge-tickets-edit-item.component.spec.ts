import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MergeTicketsEditItemComponent } from './merge-tickets-edit-item.component';

describe('MergeTicketsEditItemComponent', () => {
  let component: MergeTicketsEditItemComponent;
  let fixture: ComponentFixture<MergeTicketsEditItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MergeTicketsEditItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MergeTicketsEditItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
