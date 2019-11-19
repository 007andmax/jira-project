import { TestBed } from '@angular/core/testing';

import { CompaniesRealTimeService } from './companies-real-time.service';

describe('CompaniesRealTimeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompaniesRealTimeService = TestBed.get(CompaniesRealTimeService);
    expect(service).toBeTruthy();
  });
});
