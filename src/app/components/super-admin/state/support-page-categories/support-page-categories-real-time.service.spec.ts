import { TestBed, inject } from '@angular/core/testing';

import { SupportPageCategoriesRealTimeService } from './support-page-categories-real-time.service';

describe('SupportPageCategoriesRealTimeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupportPageCategoriesRealTimeService]
    });
  });

  it('should be created', inject([SupportPageCategoriesRealTimeService], (service: SupportPageCategoriesRealTimeService) => {
    expect(service).toBeTruthy();
  }));
});
