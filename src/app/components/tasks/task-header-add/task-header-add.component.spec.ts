import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskHeaderAddComponent } from './task-header-add.component';

describe('TaskHeaderAddComponent', () => {
  let component: TaskHeaderAddComponent;
  let fixture: ComponentFixture<TaskHeaderAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskHeaderAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskHeaderAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
