import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailDevicesDetailsComponent } from './ticket-detail-devices-details.component';

describe('TicketDetailDevicesDetailsComponent', () => {
  let component: TicketDetailDevicesDetailsComponent;
  let fixture: ComponentFixture<TicketDetailDevicesDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailDevicesDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailDevicesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
