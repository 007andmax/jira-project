import { TestBed } from '@angular/core/testing';

import { DevicesStateService } from './devices-state.service';

describe('DevicesStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DevicesStateService = TestBed.get(DevicesStateService);
    expect(service).toBeTruthy();
  });
});
