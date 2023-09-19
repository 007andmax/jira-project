import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsPriorityComponent } from './tickets-priority.component';

describe('TicketsPriorityComponent', () => {
  let component: TicketsPriorityComponent;
  let fixture: ComponentFixture<TicketsPriorityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketsPriorityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsPriorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
