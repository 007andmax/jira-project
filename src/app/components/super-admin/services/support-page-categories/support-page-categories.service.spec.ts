import { TestBed, inject } from '@angular/core/testing';

import { SupportPageCategoriesService } from './support-page-categories.service';

describe('SupportPageCategoriesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupportPageCategoriesService]
    });
  });

  it('should be created', inject([SupportPageCategoriesService], (service: SupportPageCategoriesService) => {
    expect(service).toBeTruthy();
  }));
});
