import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksDashboardMyTasksComponent } from './tasks-dashboard-my-tasks.component';

describe('TasksDashboardMyTasksComponent', () => {
  let component: TasksDashboardMyTasksComponent;
  let fixture: ComponentFixture<TasksDashboardMyTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksDashboardMyTasksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksDashboardMyTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
