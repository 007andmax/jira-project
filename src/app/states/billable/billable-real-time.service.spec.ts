import { TestBed } from '@angular/core/testing';

import { BillableRealTimeService } from './billable-real-time.service';

describe('BillableRealTimeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BillableRealTimeService = TestBed.get(BillableRealTimeService);
    expect(service).toBeTruthy();
  });
});
