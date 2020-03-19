import { TestBed } from '@angular/core/testing';

import { ReportsStateService } from './reports-state.service';

describe('ReportsStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportsStateService = TestBed.get(ReportsStateService);
    expect(service).toBeTruthy();
  });
});
