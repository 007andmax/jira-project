import { TestBed } from '@angular/core/testing';

import { InventoryListService } from './inventory-list.service';

describe('InventoryListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InventoryListService = TestBed.get(InventoryListService);
    expect(service).toBeTruthy();
  });
});
