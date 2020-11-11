import { TestBed } from '@angular/core/testing';

import { DashboardBillingService } from './dashboard-billing.service';

describe('DashboardBillingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashboardBillingService = TestBed.get(DashboardBillingService);
    expect(service).toBeTruthy();
  });
});
