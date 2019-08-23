import { TestBed } from '@angular/core/testing';

import { RecurringTicketsService } from '../../services/recurring-tickets.service';

describe('RecurringTicketsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecurringTicketsService = TestBed.get(RecurringTicketsService);
    expect(service).toBeTruthy();
  });
});
