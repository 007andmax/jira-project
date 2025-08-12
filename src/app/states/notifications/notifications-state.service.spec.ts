import { TestBed } from '@angular/core/testing';

import { NotificationsStateService } from './notifications-state.service';

describe('NotificationsStateService', () => {
  let service: NotificationsStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationsStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
