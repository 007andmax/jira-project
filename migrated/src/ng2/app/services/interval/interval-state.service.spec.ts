import { TestBed } from '@angular/core/testing';

import { IntervalStateService } from './interval-state.service';

describe('IntervalStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IntervalStateService = TestBed.get(IntervalStateService);
    expect(service).toBeTruthy();
  });
});
