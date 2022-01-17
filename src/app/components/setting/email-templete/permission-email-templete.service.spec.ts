import { TestBed, inject } from '@angular/core/testing';

import { PermissionEmailTempleteService } from './permission-email-templete.service';

describe('PermissionEmailTempleteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermissionEmailTempleteService]
    });
  });

  it('should be created', inject([PermissionEmailTempleteService], (service: PermissionEmailTempleteService) => {
    expect(service).toBeTruthy();
  }));
});
