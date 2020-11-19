import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketPriorityWidgetComponent } from './ticket-priority-widget.component';

describe('TicketPriorityWidgetComponent', () => {
  let component: TicketPriorityWidgetComponent;
  let fixture: ComponentFixture<TicketPriorityWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketPriorityWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketPriorityWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
