import { TestBed } from '@angular/core/testing';

import { NotificationsRealTimeService } from './notifications-real-time.service';

describe('NotificationsRealTimeService', () => {
  let service: NotificationsRealTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationsRealTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
