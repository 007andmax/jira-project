import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailTasksComponent } from './ticket-detail-tasks.component';

describe('TicketDetailTasksComponent', () => {
  let component: TicketDetailTasksComponent;
  let fixture: ComponentFixture<TicketDetailTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
