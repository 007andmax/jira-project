import { TestBed, inject } from '@angular/core/testing';

import { PermissionTechUserService } from './permission-tech-user.service';

describe('PermissionTechUserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermissionTechUserService]
    });
  });

  it('should be created', inject([PermissionTechUserService], (service: PermissionTechUserService) => {
    expect(service).toBeTruthy();
  }));
});
