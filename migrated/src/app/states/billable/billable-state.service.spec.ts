import { TestBed } from '@angular/core/testing';

import { BillableStateService } from './billable-state.service';

describe('BillableStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BillableStateService = TestBed.get(BillableStateService);
    expect(service).toBeTruthy();
  });
});
