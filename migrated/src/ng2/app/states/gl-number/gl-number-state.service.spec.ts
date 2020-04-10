import { TestBed } from '@angular/core/testing';

import { GlNumberStateService } from './gl-number-state.service';

describe('GlNumberStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GlNumberStateService = TestBed.get(GlNumberStateService);
    expect(service).toBeTruthy();
  });
});
