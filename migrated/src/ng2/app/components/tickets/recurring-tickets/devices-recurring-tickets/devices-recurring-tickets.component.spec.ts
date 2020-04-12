import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesRecurringTicketsComponent } from './devices-recurring-tickets.component';

describe('DevicesRecurringTicketsComponent', () => {
  let component: DevicesRecurringTicketsComponent;
  let fixture: ComponentFixture<DevicesRecurringTicketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevicesRecurringTicketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicesRecurringTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
