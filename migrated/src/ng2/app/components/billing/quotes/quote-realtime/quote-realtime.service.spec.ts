import { TestBed } from '@angular/core/testing';

import { QuoteRealtimeService } from './quote-realtime.service';

describe('QuoteRealtimeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuoteRealtimeService = TestBed.get(QuoteRealtimeService);
    expect(service).toBeTruthy();
  });
});
