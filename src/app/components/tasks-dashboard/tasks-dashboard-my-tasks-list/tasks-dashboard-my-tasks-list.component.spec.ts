import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksDashboardMyTasksListComponent } from './tasks-dashboard-my-tasks-list.component';

describe('TasksDashboardMyTasksListComponent', () => {
  let component: TasksDashboardMyTasksListComponent;
  let fixture: ComponentFixture<TasksDashboardMyTasksListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksDashboardMyTasksListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksDashboardMyTasksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
