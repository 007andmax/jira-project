import { TestBed, inject } from '@angular/core/testing';

import { TagsRealTimeService } from './tags-real-time.service';

describe('TagsRealTimeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TagsRealTimeService]
    });
  });

  it('should be created', inject([TagsRealTimeService], (service: TagsRealTimeService) => {
    expect(service).toBeTruthy();
  }));
});
