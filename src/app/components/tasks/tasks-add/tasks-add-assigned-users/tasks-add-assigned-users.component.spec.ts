import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksAddAssignedUsersComponent } from './tasks-add-assigned-users.component';

describe('TasksAddAssignedUsersComponent', () => {
  let component: TasksAddAssignedUsersComponent;
  let fixture: ComponentFixture<TasksAddAssignedUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksAddAssignedUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksAddAssignedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
