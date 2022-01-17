import { TestBed, inject } from '@angular/core/testing';

import { PermissionAccountingSettingsService } from './permission-accounting-settings.service';

describe('PermissionAccountingSettingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermissionAccountingSettingsService]
    });
  });

  it('should be created', inject([PermissionAccountingSettingsService], (service: PermissionAccountingSettingsService) => {
    expect(service).toBeTruthy();
  }));
});
