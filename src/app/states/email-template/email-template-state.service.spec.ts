import { TestBed, inject } from '@angular/core/testing';

import { EmailTemplateStateService } from './email-template-state.service';

describe('EmailTemplateStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmailTemplateStateService]
    });
  });

  it('should be created', inject([EmailTemplateStateService], (service: EmailTemplateStateService) => {
    expect(service).toBeTruthy();
  }));
});
