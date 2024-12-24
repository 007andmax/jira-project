import { TestBed } from '@angular/core/testing';

import { SubscriptionServicesService } from './subscription-services.service';

describe('SubscriptionServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubscriptionServicesService = TestBed.get(SubscriptionServicesService);
    expect(service).toBeTruthy();
  });
});
