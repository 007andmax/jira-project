import { TestBed } from '@angular/core/testing';

import { KnowledgeBaseStateService } from './knowledge-base-state.service';

describe('KnowledgeBaseStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KnowledgeBaseStateService = TestBed.get(KnowledgeBaseStateService);
    expect(service).toBeTruthy();
  });
});
