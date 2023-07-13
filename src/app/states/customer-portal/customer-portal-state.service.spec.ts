import { TestBed, inject } from '@angular/core/testing';

import { CustomerPortalStateService } from './customer-portal-state.service';

describe('CustomerPortalStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerPortalStateService]
    });
  });

  it('should be created', inject([CustomerPortalStateService], (service: CustomerPortalStateService) => {
    expect(service).toBeTruthy();
  }));
});
