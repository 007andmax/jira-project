import { TestBed } from '@angular/core/testing';

import { TagsStateService } from './tags-state.service';

describe('TagsStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TagsStateService = TestBed.get(TagsStateService);
    expect(service).toBeTruthy();
  });
});
