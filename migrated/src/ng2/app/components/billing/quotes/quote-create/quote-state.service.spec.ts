import { TestBed } from '@angular/core/testing';

import { QuoteStateService } from './quote-state.service';

describe('QuoteStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuoteStateService = TestBed.get(QuoteStateService);
    expect(service).toBeTruthy();
  });
});
