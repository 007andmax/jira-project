import { TestBed } from '@angular/core/testing';

import { TicketPreviewReportStateService } from './ticket-preview-report-state.service';

describe('TicketPreviewReportStateService', () => {
  let service: TicketPreviewReportStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketPreviewReportStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
