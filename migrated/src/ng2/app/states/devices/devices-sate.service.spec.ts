import { TestBed } from '@angular/core/testing';

import { DevicesSateService } from './devices-sate.service';

describe('DevicesSateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DevicesSateService = TestBed.get(DevicesSateService);
    expect(service).toBeTruthy();
  });
});
