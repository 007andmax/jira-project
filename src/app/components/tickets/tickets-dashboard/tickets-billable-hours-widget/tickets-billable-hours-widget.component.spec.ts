import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsBillableHoursWidgetComponent } from './tickets-billable-hours-widget.component';

describe('TicketsBillableHoursWidgetComponent', () => {
  let component: TicketsBillableHoursWidgetComponent;
  let fixture: ComponentFixture<TicketsBillableHoursWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketsBillableHoursWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsBillableHoursWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
