import { TestBed } from '@angular/core/testing';

import { DeviceTagsRealTimeService } from './device-tags-real-time.service';

describe('DeviceTagsRealTimeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeviceTagsRealTimeService = TestBed.get(DeviceTagsRealTimeService);
    expect(service).toBeTruthy();
  });
});
