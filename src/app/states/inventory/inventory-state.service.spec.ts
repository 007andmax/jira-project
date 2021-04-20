import { TestBed } from '@angular/core/testing';

import { InventoryStateService } from './inventory-state.service';

describe('InventoryStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InventoryStateService = TestBed.get(InventoryStateService);
    expect(service).toBeTruthy();
  });
});
