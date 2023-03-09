import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailDevicesComponent } from './ticket-detail-devices.component';

describe('TicketDetailDevicesComponent', () => {
  let component: TicketDetailDevicesComponent;
  let fixture: ComponentFixture<TicketDetailDevicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailDevicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
