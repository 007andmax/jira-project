import { TestBed } from '@angular/core/testing';

import { TicketsStateService } from './tickets-state.service';

describe('TicketsStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TicketsStateService = TestBed.get(TicketsStateService);
    expect(service).toBeTruthy();
  });
});
