import { TestBed } from '@angular/core/testing';

import { CompanyNetworkScanService } from './company-network-scan.service';

describe('CompanyNetworkScanService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompanyNetworkScanService = TestBed.get(CompanyNetworkScanService);
    expect(service).toBeTruthy();
  });
});
