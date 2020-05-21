import { TestBed } from '@angular/core/testing';

import { ErrorNotificationStateService } from './error-notification-state.service';

describe('ErrorNotificationStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ErrorNotificationStateService = TestBed.get(ErrorNotificationStateService);
    expect(service).toBeTruthy();
  });
});
