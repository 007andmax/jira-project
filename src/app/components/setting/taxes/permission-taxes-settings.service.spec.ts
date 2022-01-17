import { TestBed, inject } from '@angular/core/testing';

import { PermissionTaxesSettingsService } from './permission-taxes-settings.service';

describe('PermissionTaxesSettingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermissionTaxesSettingsService]
    });
  });

  it('should be created', inject([PermissionTaxesSettingsService], (service: PermissionTaxesSettingsService) => {
    expect(service).toBeTruthy();
  }));
});
