import { TestBed } from '@angular/core/testing';

import { GlNumberService } from './gl-number.service';

describe('GlNumberService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GlNumberService = TestBed.get(GlNumberService);
    expect(service).toBeTruthy();
  });
});
