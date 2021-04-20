import { TestBed } from '@angular/core/testing';

import { TaxesStateService } from './taxes-state.service';

describe('TaxesStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TaxesStateService = TestBed.get(TaxesStateService);
    expect(service).toBeTruthy();
  });
});
