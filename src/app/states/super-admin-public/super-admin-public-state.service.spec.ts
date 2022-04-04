import { TestBed, inject } from '@angular/core/testing';

import { SuperAdminPublicStateService } from './super-admin-public-state.service';

describe('SuperAdminPublicStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SuperAdminPublicStateService]
    });
  });

  it('should be created', inject([SuperAdminPublicStateService], (service: SuperAdminPublicStateService) => {
    expect(service).toBeTruthy();
  }));
});
