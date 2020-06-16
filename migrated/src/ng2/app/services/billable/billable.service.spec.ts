import { TestBed } from '@angular/core/testing';

import { BillableService } from './billable.service';

describe('BillableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BillableService = TestBed.get(BillableService);
    expect(service).toBeTruthy();
  });
});
