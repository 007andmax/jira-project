import { TestBed } from '@angular/core/testing';

import { NonContractServicesStateService } from './non-contract-services-state.service';

describe('NonContractServicesStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NonContractServicesStateService = TestBed.get(NonContractServicesStateService);
    expect(service).toBeTruthy();
  });
});
