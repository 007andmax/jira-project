import { TestBed } from '@angular/core/testing';

import { TicketsTableService } from './tickets-table.service';

describe('TicketsTableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TicketsTableService = TestBed.get(TicketsTableService);
    expect(service).toBeTruthy();
  });
});
