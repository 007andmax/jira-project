import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailTicketsStatusComponent } from './ticket-detail-tickets-status.component';

describe('TicketDetailTicketsStatusComponent', () => {
  let component: TicketDetailTicketsStatusComponent;
  let fixture: ComponentFixture<TicketDetailTicketsStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailTicketsStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailTicketsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
