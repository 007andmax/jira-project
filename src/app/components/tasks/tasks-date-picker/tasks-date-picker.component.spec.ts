import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksDatePickerComponent } from './tasks-date-picker.component';

describe('TasksDatePickerComponent', () => {
  let component: TasksDatePickerComponent;
  let fixture: ComponentFixture<TasksDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksDatePickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
