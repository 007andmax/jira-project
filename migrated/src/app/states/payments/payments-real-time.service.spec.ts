import { TestBed } from '@angular/core/testing';

import { PaymentsRealTimeService } from './payments-real-time.service';

describe('PaymentsRealTimeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PaymentsRealTimeService = TestBed.get(PaymentsRealTimeService);
    expect(service).toBeTruthy();
  });
});
