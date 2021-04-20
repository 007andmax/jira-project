import { TestBed } from '@angular/core/testing';

import { ConstantsStateService } from './constants-state.service';

describe('ConstantsStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConstantsStateService = TestBed.get(ConstantsStateService);
    expect(service).toBeTruthy();
  });
});
