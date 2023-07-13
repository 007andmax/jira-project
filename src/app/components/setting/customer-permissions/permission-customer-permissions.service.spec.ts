import { TestBed, inject } from '@angular/core/testing';

import { PermissionCustomerPermissionsService } from './permission-customer-permissions.service';

describe('PermissionCustomerPermissionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermissionCustomerPermissionsService]
    });
  });

  it('should be created', inject([PermissionCustomerPermissionsService], (service: PermissionCustomerPermissionsService) => {
    expect(service).toBeTruthy();
  }));
});
