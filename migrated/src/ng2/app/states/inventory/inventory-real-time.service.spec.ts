import { TestBed } from '@angular/core/testing';

import { InventoryRealTimeService } from './inventory-real-time.service';

describe('InventoryRealTimeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InventoryRealTimeService = TestBed.get(InventoryRealTimeService);
    expect(service).toBeTruthy();
  });
});
