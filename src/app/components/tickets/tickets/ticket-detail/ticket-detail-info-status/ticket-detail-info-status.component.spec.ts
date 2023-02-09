import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailInfoStatusComponent } from './ticket-detail-info-status.component';

describe('TicketDetailInfoStatusComponent', () => {
  let component: TicketDetailInfoStatusComponent;
  let fixture: ComponentFixture<TicketDetailInfoStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailInfoStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailInfoStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
