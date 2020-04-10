import { TestBed } from '@angular/core/testing';

import { TicketReportStateService } from './ticket-report-state.service';

describe('TicketReportStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TicketReportStateService = TestBed.get(TicketReportStateService);
    expect(service).toBeTruthy();
  });
});
