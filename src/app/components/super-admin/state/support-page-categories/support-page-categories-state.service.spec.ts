import { TestBed, inject } from '@angular/core/testing';

import { SupportPageCategoriesStateService } from './support-page-categories-state.service';

describe('SupportPageCategoriesStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupportPageCategoriesStateService]
    });
  });

  it('should be created', inject([SupportPageCategoriesStateService], (service: SupportPageCategoriesStateService) => {
    expect(service).toBeTruthy();
  }));
});
