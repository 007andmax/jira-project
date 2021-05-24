import { TestBed, inject } from '@angular/core/testing';

import { TagsStateService } from './tags-state.service';

describe('TagsStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TagsStateService]
    });
  });

  it('should be created', inject([TagsStateService], (service: TagsStateService) => {
    expect(service).toBeTruthy();
  }));
});
