import { TestBed, inject } from '@angular/core/testing';

import { ManageTagsListService } from './manage-tags-list.service';

describe('ManageTagsListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManageTagsListService]
    });
  });

  it('should be created', inject([ManageTagsListService], (service: ManageTagsListService) => {
    expect(service).toBeTruthy();
  }));
});
