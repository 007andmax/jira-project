import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillableTicketsComponent } from './billable-tickets.component';

describe('BillableTicketsComponent', () => {
  let component: BillableTicketsComponent;
  let fixture: ComponentFixture<BillableTicketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillableTicketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillableTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
