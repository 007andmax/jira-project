import { TestBed } from '@angular/core/testing';

import { InvoiceStateService } from './invoice-state.service';

describe('InvoiceStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InvoiceStateService = TestBed.get(InvoiceStateService);
    expect(service).toBeTruthy();
  });
});
