import { TestBed } from '@angular/core/testing';

import { QuotesListService } from './quotes-list.service';

describe('QuotesListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuotesListService = TestBed.get(QuotesListService);
    expect(service).toBeTruthy();
  });
});
