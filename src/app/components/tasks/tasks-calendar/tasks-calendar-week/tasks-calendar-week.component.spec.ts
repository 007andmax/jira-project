import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksCalendarWeekComponent } from './tasks-calendar-week.component';

describe('TasksCalendarWeekComponent', () => {
  let component: TasksCalendarWeekComponent;
  let fixture: ComponentFixture<TasksCalendarWeekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksCalendarWeekComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksCalendarWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
