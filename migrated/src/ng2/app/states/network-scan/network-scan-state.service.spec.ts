import { TestBed } from '@angular/core/testing';

import { NetworkScanStateService } from './network-scan-state.service';

describe('NetworkScanStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NetworkScanStateService = TestBed.get(NetworkScanStateService);
    expect(service).toBeTruthy();
  });
});
