import { TestBed, inject } from '@angular/core/testing';

import { SuperAdminPublicSearchListService } from './super-admin-public-search-list.service';

describe('SuperAdminPublicSearchListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SuperAdminPublicSearchListService]
    });
  });

  it('should be created', inject([SuperAdminPublicSearchListService], (service: SuperAdminPublicSearchListService) => {
    expect(service).toBeTruthy();
  }));
});
