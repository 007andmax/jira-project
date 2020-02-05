import { TestBed } from '@angular/core/testing';

import { DraftEmailService } from './draft-email.service';

describe('DraftEmailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DraftEmailService = TestBed.get(DraftEmailService);
    expect(service).toBeTruthy();
  });
});
