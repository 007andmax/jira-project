import { TestBed } from '@angular/core/testing';

import { InvoicesListService } from './invoices-list.service';

describe('InvoicesListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InvoicesListService = TestBed.get(InvoicesListService);
    expect(service).toBeTruthy();
  });
});
