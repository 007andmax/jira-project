import { TestBed } from '@angular/core/testing';

import { RecurringService } from './recurring.service';

describe('RecurringService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecurringService = TestBed.get(RecurringService);
    expect(service).toBeTruthy();
  });
});
