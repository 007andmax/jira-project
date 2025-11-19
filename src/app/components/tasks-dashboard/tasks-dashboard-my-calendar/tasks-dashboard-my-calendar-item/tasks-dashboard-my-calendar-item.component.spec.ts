import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksDashboardMyCalendarItemComponent } from './tasks-dashboard-my-calendar-item.component';

describe('TasksDashboardMyCalendarItemComponent', () => {
  let component: TasksDashboardMyCalendarItemComponent;
  let fixture: ComponentFixture<TasksDashboardMyCalendarItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksDashboardMyCalendarItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksDashboardMyCalendarItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
