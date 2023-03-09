import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailContactDetailsHistoryComponent } from './ticket-detail-contact-details-history.component';

describe('TicketDetailContactDetailsHistoryComponent', () => {
  let component: TicketDetailContactDetailsHistoryComponent;
  let fixture: ComponentFixture<TicketDetailContactDetailsHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailContactDetailsHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailContactDetailsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
