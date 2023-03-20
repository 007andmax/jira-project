import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailDevicesItemComponent } from './ticket-detail-devices-item.component';

describe('TicketDetailDevicesItemComponent', () => {
  let component: TicketDetailDevicesItemComponent;
  let fixture: ComponentFixture<TicketDetailDevicesItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailDevicesItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailDevicesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
