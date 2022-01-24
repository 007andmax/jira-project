import { TestBed, inject } from '@angular/core/testing';

import { MarketingEmailService } from './marketing-email.service';

describe('MarketingEmailService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MarketingEmailService]
    });
  });

  it('should be created', inject([MarketingEmailService], (service: MarketingEmailService) => {
    expect(service).toBeTruthy();
  }));
});
