import { TestBed } from '@angular/core/testing';

import { MapModalStateService } from './map-modal-state.service';

describe('MapModalStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapModalStateService = TestBed.get(MapModalStateService);
    expect(service).toBeTruthy();
  });
});
