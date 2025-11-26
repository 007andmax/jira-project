import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksCalendarWeekItemAllDayComponent } from './tasks-calendar-week-item-all-day.component';

describe('TasksCalendarWeekItemAllDayComponent', () => {
  let component: TasksCalendarWeekItemAllDayComponent;
  let fixture: ComponentFixture<TasksCalendarWeekItemAllDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksCalendarWeekItemAllDayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksCalendarWeekItemAllDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
