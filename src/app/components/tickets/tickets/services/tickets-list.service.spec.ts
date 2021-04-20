import { TestBed } from '@angular/core/testing';

import { TicketsListService } from './tickets-list.service';

describe('TicketsListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TicketsListService = TestBed.get(TicketsListService);
    expect(service).toBeTruthy();
  });
});
