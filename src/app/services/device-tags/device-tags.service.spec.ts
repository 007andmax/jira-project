import { TestBed } from '@angular/core/testing';

import { DeviceTagsService } from './device-tags.service';

describe('DeviceTagsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeviceTagsService = TestBed.get(DeviceTagsService);
    expect(service).toBeTruthy();
  });
});
