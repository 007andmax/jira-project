import { TestBed } from '@angular/core/testing';

import { PaymentsStateService } from './payments-state.service';

describe('PaymentsStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PaymentsStateService = TestBed.get(PaymentsStateService);
    expect(service).toBeTruthy();
  });
});
