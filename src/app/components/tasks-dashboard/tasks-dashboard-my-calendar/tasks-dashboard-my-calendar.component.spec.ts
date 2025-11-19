import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksDashboardMyCalendarComponent } from './tasks-dashboard-my-calendar.component';

describe('TasksDashboardMyCalendarComponent', () => {
  let component: TasksDashboardMyCalendarComponent;
  let fixture: ComponentFixture<TasksDashboardMyCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksDashboardMyCalendarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksDashboardMyCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
