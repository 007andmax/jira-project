import { TestBed } from '@angular/core/testing';

import { TasksRealTimeService } from './tasks-real-time.service';

describe('TasksRealTimeService', () => {
  let service: TasksRealTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TasksRealTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
