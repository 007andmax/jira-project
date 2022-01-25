import { TestBed, inject } from '@angular/core/testing';

import { MarketingEmailStateService } from './marketing-email-state.service';

describe('MarketingEmailStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MarketingEmailStateService]
    });
  });

  it('should be created', inject([MarketingEmailStateService], (service: MarketingEmailStateService) => {
    expect(service).toBeTruthy();
  }));
});
