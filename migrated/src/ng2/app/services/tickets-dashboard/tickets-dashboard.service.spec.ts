import { TestBed } from '@angular/core/testing';

import { TicketsDashboardService } from './tickets-dashboard.service';

describe('TicketsDashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TicketsDashboardService = TestBed.get(TicketsDashboardService);
    expect(service).toBeTruthy();
  });
});
