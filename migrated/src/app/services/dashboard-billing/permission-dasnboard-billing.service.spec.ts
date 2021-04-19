import { TestBed } from '@angular/core/testing';

import { PermissionDasnboardBillingService } from './permission-dasnboard-billing.service';

describe('PermissionDasnboardBillingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PermissionDasnboardBillingService = TestBed.get(PermissionDasnboardBillingService);
    expect(service).toBeTruthy();
  });
});
