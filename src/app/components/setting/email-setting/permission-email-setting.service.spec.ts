import { TestBed, inject } from '@angular/core/testing';

import { PermissionEmailSettingService } from './permission-email-setting.service';

describe('PermissionEmailSettingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermissionEmailSettingService]
    });
  });

  it('should be created', inject([PermissionEmailSettingService], (service: PermissionEmailSettingService) => {
    expect(service).toBeTruthy();
  }));
});
