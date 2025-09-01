import { TestBed } from '@angular/core/testing';

import { TasksStateService } from './tasks-state.service';

describe('TasksStateService', () => {
  let service: TasksStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TasksStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
