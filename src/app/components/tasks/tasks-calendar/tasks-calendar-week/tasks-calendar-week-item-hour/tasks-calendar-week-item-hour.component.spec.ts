import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksCalendarWeekItemHourComponent } from './tasks-calendar-week-item-hour.component';

describe('TasksCalendarWeekItemHourComponent', () => {
  let component: TasksCalendarWeekItemHourComponent;
  let fixture: ComponentFixture<TasksCalendarWeekItemHourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksCalendarWeekItemHourComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksCalendarWeekItemHourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
