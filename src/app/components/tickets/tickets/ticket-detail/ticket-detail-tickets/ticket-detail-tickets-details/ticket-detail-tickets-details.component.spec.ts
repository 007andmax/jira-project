import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailTicketsDetailsComponent } from './ticket-detail-tickets-details.component';

describe('TicketDetailTicketsDetailsComponent', () => {
  let component: TicketDetailTicketsDetailsComponent;
  let fixture: ComponentFixture<TicketDetailTicketsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailTicketsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailTicketsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
