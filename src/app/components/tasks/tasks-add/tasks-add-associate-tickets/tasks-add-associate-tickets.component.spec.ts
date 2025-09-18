import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksAddAssociateTicketsComponent } from './tasks-add-associate-tickets.component';

describe('TasksAddAssociateTicketsComponent', () => {
  let component: TasksAddAssociateTicketsComponent;
  let fixture: ComponentFixture<TasksAddAssociateTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksAddAssociateTicketsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksAddAssociateTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
