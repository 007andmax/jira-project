import { TestBed } from '@angular/core/testing';

import { RecurringTicketsStateService } from './recurring-tickets-state.service';

describe('RecurringTicketsStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecurringTicketsStateService = TestBed.get(RecurringTicketsStateService);
    expect(service).toBeTruthy();
  });
});
