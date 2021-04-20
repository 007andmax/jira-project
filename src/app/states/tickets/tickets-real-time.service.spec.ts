import { TestBed } from '@angular/core/testing';

import { TicketsRealTimeService } from './tickets-real-time.service';

describe('TicketsRealTimeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TicketsRealTimeService = TestBed.get(TicketsRealTimeService);
    expect(service).toBeTruthy();
  });
});
