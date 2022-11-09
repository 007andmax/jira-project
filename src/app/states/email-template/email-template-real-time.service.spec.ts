import { TestBed, inject } from '@angular/core/testing';

import { EmailTemplateRealTimeService } from './email-template-real-time.service';

describe('EmailTemplateRealTimeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmailTemplateRealTimeService]
    });
  });

  it('should be created', inject([EmailTemplateRealTimeService], (service: EmailTemplateRealTimeService) => {
    expect(service).toBeTruthy();
  }));
});
