import { TestBed } from '@angular/core/testing';

import { TaxesRealTimeService } from './taxes-real-time.service';

describe('TaxesRealTimeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TaxesRealTimeService = TestBed.get(TaxesRealTimeService);
    expect(service).toBeTruthy();
  });
});
