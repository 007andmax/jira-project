import { TestBed } from '@angular/core/testing';

import { GlNumberRealTimeService } from './gl-number-real-time.service';

describe('GlNumberRealTimeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GlNumberRealTimeService = TestBed.get(GlNumberRealTimeService);
    expect(service).toBeTruthy();
  });
});
