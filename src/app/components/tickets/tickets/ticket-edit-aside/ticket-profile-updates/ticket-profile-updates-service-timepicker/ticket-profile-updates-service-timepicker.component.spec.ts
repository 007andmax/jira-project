import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketProfileUpdatesServiceTimepickerComponent } from './ticket-profile-updates-service-timepicker.component';

describe('TicketProfileUpdatesServiceTimepickerComponent', () => {
  let component: TicketProfileUpdatesServiceTimepickerComponent;
  let fixture: ComponentFixture<TicketProfileUpdatesServiceTimepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketProfileUpdatesServiceTimepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketProfileUpdatesServiceTimepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
