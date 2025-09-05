import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksDashboardStatsComponent } from './tasks-dashboard-stats.component';

describe('TasksDashboardStatsComponent', () => {
  let component: TasksDashboardStatsComponent;
  let fixture: ComponentFixture<TasksDashboardStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksDashboardStatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksDashboardStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
