import { TestBed, inject } from '@angular/core/testing';

import { CompanyTagsListService } from './company-tags-list.service';

describe('CompanyTagsListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyTagsListService]
    });
  });

  it('should be created', inject([CompanyTagsListService], (service: CompanyTagsListService) => {
    expect(service).toBeTruthy();
  }));
});
