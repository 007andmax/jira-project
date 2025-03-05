import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailTotalStatisticsComponent } from './ticket-detail-total-statistics.component';

describe('TicketDetailTotalStatisticsComponent', () => {
  let component: TicketDetailTotalStatisticsComponent;
  let fixture: ComponentFixture<TicketDetailTotalStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailTotalStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailTotalStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
