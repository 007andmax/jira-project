import { TestBed, inject } from '@angular/core/testing';

import { PermissionCrmSettingsService } from './permission-crm-settings.service';

describe('PermissionCrmSettingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermissionCrmSettingsService]
    });
  });

  it('should be created', inject([PermissionCrmSettingsService], (service: PermissionCrmSettingsService) => {
    expect(service).toBeTruthy();
  }));
});
