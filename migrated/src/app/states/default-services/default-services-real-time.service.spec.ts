import { TestBed } from '@angular/core/testing';

import { DefaultServicesRealTimeService } from './default-services-real-time.service';

describe('DefaultServicesRealTimeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DefaultServicesRealTimeService = TestBed.get(DefaultServicesRealTimeService);
    expect(service).toBeTruthy();
  });
});
