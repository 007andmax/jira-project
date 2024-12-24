import { TestBed } from '@angular/core/testing';

import { SubscriptionServicesStateService } from './subscription-services-state.service';

describe('SubscriptionServicesStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubscriptionServicesStateService = TestBed.get(SubscriptionServicesStateService);
    expect(service).toBeTruthy();
  });
});
