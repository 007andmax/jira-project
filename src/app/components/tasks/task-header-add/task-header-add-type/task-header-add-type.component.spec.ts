import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskHeaderAddTypeComponent } from './task-header-add-type.component';

describe('TaskHeaderAddTypeComponent', () => {
  let component: TaskHeaderAddTypeComponent;
  let fixture: ComponentFixture<TaskHeaderAddTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskHeaderAddTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskHeaderAddTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
