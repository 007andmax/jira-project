import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksTabsComponent } from './tasks-tabs.component';

describe('TasksTabsComponent', () => {
  let component: TasksTabsComponent;
  let fixture: ComponentFixture<TasksTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksTabsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
