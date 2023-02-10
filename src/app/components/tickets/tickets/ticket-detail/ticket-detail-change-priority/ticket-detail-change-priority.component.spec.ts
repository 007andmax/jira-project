import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailChangePriorityComponent } from './ticket-detail-change-priority.component';

describe('TicketDetailChangePriorityComponent', () => {
  let component: TicketDetailChangePriorityComponent;
  let fixture: ComponentFixture<TicketDetailChangePriorityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailChangePriorityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailChangePriorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
