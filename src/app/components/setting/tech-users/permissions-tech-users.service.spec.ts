import { TestBed, inject } from '@angular/core/testing';

import { PermissionsTechUsersService } from './permissions-tech-users.service';

describe('PermissionsTechUsersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermissionsTechUsersService]
    });
  });

  it('should be created', inject([PermissionsTechUsersService], (service: PermissionsTechUsersService) => {
    expect(service).toBeTruthy();
  }));
});
