import { TestBed } from '@angular/core/testing';

import { NonContractServicesRealTimeService } from './non-contract-services-real-time.service';

describe('NonContractServicesRealTimeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NonContractServicesRealTimeService = TestBed.get(NonContractServicesRealTimeService);
    expect(service).toBeTruthy();
  });
});
