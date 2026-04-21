import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailTotalStatisticsComponent } from './ticket-detail-total-statistics.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('TicketDetailTotalStatisticsComponent unit test', () => {
  let component: TicketDetailTotalStatisticsComponent;
  let fixture: ComponentFixture<TicketDetailTotalStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        NgbModule,
        NoopAnimationsModule, TicketDetailTotalStatisticsComponent]
}).compileComponents();

  });

  it('check "getTotalWorked"', () => {
    const fixture = TestBed.createComponent(TicketDetailTotalStatisticsComponent);
    const com = fixture.debugElement.componentInstance;
    com.ticketProfile.totalTimeWorked = 100;
    expect(com.getTotalWorked()).toEqual("100:00 hr(s)");
  });

});