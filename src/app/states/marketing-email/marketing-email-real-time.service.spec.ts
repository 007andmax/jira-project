import { TestBed, inject } from '@angular/core/testing';

import { MarketingEmailRealTimeService } from './marketing-email-real-time.service';

describe('MarketingEmailRealTimeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MarketingEmailRealTimeService]
    });
  });

  it('should be created', inject([MarketingEmailRealTimeService], (service: MarketingEmailRealTimeService) => {
    expect(service).toBeTruthy();
  }));
});
