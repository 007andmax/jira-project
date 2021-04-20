import { TestBed } from '@angular/core/testing';

import { InvoiceRealTimeService } from './invoice-real-time.service';

describe('InvoiceRealTimeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InvoiceRealTimeService = TestBed.get(InvoiceRealTimeService);
    expect(service).toBeTruthy();
  });
});
