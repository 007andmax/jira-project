import { TestBed } from '@angular/core/testing';

import { CompanyTagsStateService } from './company-tags-state.service';

describe('CompanyTagsStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompanyTagsStateService = TestBed.get(CompanyTagsStateService);
    expect(service).toBeTruthy();
  });
});
