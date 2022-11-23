import { TestBed, inject } from '@angular/core/testing';

import { DeviceSettingStateService } from './device-setting-state.service';

describe('DeviceSettingStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeviceSettingStateService]
    });
  });

  it('should be created', inject([DeviceSettingStateService], (service: DeviceSettingStateService) => {
    expect(service).toBeTruthy();
  }));
});
