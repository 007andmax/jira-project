import { TestBed, inject } from '@angular/core/testing';

import { PermissionSuperAdminService } from './permission-super-admin.service';

describe('PermissionSuperAdminService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermissionSuperAdminService]
    });
  });

  it('should be created', inject([PermissionSuperAdminService], (service: PermissionSuperAdminService) => {
    expect(service).toBeTruthy();
  }));
});
