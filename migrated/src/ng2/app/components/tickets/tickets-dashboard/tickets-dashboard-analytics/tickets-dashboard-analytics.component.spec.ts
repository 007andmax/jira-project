import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsDashboardAnalyticsComponent } from './tickets-dashboard-analytics.component';

describe('TicketsDashboardAnalyticsComponent', () => {
  let component: TicketsDashboardAnalyticsComponent;
  let fixture: ComponentFixture<TicketsDashboardAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketsDashboardAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsDashboardAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
