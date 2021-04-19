import { TestBed } from '@angular/core/testing';

import { DevicesRealTimeService } from './devices-real-time.service';

describe('DevicesRealTimeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DevicesRealTimeService = TestBed.get(DevicesRealTimeService);
    expect(service).toBeTruthy();
  });
});
