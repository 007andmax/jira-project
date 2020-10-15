import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringTicketDashboardComponent } from './recurring-ticket-dashboard.component';

describe('RecurringTicketDashboardComponent', () => {
  let component: RecurringTicketDashboardComponent;
  let fixture: ComponentFixture<RecurringTicketDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecurringTicketDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecurringTicketDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
