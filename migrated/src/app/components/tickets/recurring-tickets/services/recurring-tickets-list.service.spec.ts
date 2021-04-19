import { TestBed } from '@angular/core/testing';

import { RecurringTicketsListService } from './recurring-tickets-list.service';

describe('RecurringTicketsListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecurringTicketsListService = TestBed.get(RecurringTicketsListService);
    expect(service).toBeTruthy();
  });
});
