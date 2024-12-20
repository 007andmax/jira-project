import { TestBed } from '@angular/core/testing';

import { QuoteRealTimeService } from './quote-realtime.service';

describe('QuoteRealTimeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuoteRealTimeService = TestBed.get(QuoteRealTimeService);
    expect(service).toBeTruthy();
  });
});
