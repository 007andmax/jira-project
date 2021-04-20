import { TestBed } from '@angular/core/testing';

import { DurationStateService } from './duration-state.service';

describe('DurationStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DurationStateService = TestBed.get(DurationStateService);
    expect(service).toBeTruthy();
  });
});
