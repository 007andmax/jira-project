import { TestBed, inject } from '@angular/core/testing';

import { PermissionProductsSettingsService } from './permission-products-settings.service';

describe('PermissionProductsSettingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermissionProductsSettingsService]
    });
  });

  it('should be created', inject([PermissionProductsSettingsService], (service: PermissionProductsSettingsService) => {
    expect(service).toBeTruthy();
  }));
});
