import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksCalendarMonthItemWeekComponent } from './tasks-calendar-month-item-week.component';

describe('TasksCalendarMonthItemWeekComponent', () => {
  let component: TasksCalendarMonthItemWeekComponent;
  let fixture: ComponentFixture<TasksCalendarMonthItemWeekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksCalendarMonthItemWeekComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksCalendarMonthItemWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
