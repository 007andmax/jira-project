import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringTicketWidgetComponent } from './recurring-ticket-widget.component';

describe('RecurringTicketWidgetComponent', () => {
  let component: RecurringTicketWidgetComponent;
  let fixture: ComponentFixture<RecurringTicketWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecurringTicketWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecurringTicketWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
