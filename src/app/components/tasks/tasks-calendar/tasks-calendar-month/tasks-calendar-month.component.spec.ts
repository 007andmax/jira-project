import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksCalendarMonthComponent } from './tasks-calendar-month.component';

describe('TasksCalendarMonthComponent', () => {
  let component: TasksCalendarMonthComponent;
  let fixture: ComponentFixture<TasksCalendarMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksCalendarMonthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksCalendarMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
