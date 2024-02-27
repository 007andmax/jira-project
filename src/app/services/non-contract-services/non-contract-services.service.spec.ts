import { TestBed } from '@angular/core/testing';

import { NonContractServicesService } from './non-contract-services.service';

describe('NonContractServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NonContractServicesService = TestBed.get(NonContractServicesService);
    expect(service).toBeTruthy();
  });
});
