import { TestBed } from '@angular/core/testing';

import { RecurringTicketsRealTimeService } from './recurring-tickets-real-time.service';

describe('RecurringTicketsRealTimeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecurringTicketsRealTimeService = TestBed.get(RecurringTicketsRealTimeService);
    expect(service).toBeTruthy();
  });
});
