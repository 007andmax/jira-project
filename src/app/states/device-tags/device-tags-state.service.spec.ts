import { TestBed } from '@angular/core/testing';

import { DeviceTagsStateService } from './device-tags-state.service';

describe('DeviceTagsStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeviceTagsStateService = TestBed.get(DeviceTagsStateService);
    expect(service).toBeTruthy();
  });
});
