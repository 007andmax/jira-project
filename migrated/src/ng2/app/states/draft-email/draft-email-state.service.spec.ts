import { TestBed } from '@angular/core/testing';

import { DraftEmailStateService } from './draft-email-state.service';

describe('DraftEmailStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DraftEmailStateService = TestBed.get(DraftEmailStateService);
    expect(service).toBeTruthy();
  });
});
