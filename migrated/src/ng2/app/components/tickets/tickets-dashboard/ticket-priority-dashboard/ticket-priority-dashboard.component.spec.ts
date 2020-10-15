import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketPriorityDashboardComponent } from './ticket-priority-dashboard.component';

describe('TicketPriorityDashboardComponent', () => {
  let component: TicketPriorityDashboardComponent;
  let fixture: ComponentFixture<TicketPriorityDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketPriorityDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketPriorityDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
