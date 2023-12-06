import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailTicketsComponent } from './ticket-detail-tickets.component';

describe('TicketDetailTicketsComponent', () => {
  let component: TicketDetailTicketsComponent;
  let fixture: ComponentFixture<TicketDetailTicketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailTicketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
