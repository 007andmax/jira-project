import { TestBed } from '@angular/core/testing';

import { CompanyTagsService } from './company-tags.service';

describe('CompanyTagsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompanyTagsService = TestBed.get(CompanyTagsService);
    expect(service).toBeTruthy();
  });
});
