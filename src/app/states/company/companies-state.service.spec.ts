import { TestBed } from '@angular/core/testing';

import { CompaniesStateService } from './companies-state.service';

describe('CompaniesStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompaniesStateService = TestBed.get(CompaniesStateService);
    expect(service).toBeTruthy();
  });
});
