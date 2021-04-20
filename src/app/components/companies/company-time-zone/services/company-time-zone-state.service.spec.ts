import { TestBed } from '@angular/core/testing';

import { CompanyTimeZoneStateService } from './company-time-zone-state.service';

describe('CompanyTimeZoneStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompanyTimeZoneStateService = TestBed.get(CompanyTimeZoneStateService);
    expect(service).toBeTruthy();
  });
});
