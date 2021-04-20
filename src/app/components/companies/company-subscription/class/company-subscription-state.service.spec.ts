import { TestBed } from '@angular/core/testing';

import { CompanySubscriptionStateService } from './company-subscription-state.service';

describe('CompanySubscriptionStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompanySubscriptionStateService = TestBed.get(CompanySubscriptionStateService);
    expect(service).toBeTruthy();
  });
});
