import { TestBed } from '@angular/core/testing';

import { PaymentsListService } from './payments-list.service';

describe('PaymentsListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PaymentsListService = TestBed.get(PaymentsListService);
    expect(service).toBeTruthy();
  });
});
