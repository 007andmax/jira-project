import { TestBed } from '@angular/core/testing';

import { SelectClientCompanyStateService } from './select-client-company-state.service';

describe('SelectClientCompanyStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SelectClientCompanyStateService = TestBed.get(SelectClientCompanyStateService);
    expect(service).toBeTruthy();
  });
});
