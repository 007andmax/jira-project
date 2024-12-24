import { TestBed } from '@angular/core/testing';

import { SubscriptionServicesRealTimeService } from './subscription-services-real-time.service';

describe('SubscriptionServicesRealTimeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubscriptionServicesRealTimeService = TestBed.get(SubscriptionServicesRealTimeService);
    expect(service).toBeTruthy();
  });
});
