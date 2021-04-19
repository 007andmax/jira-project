import { TestBed, inject } from '@angular/core/testing';

import { NotificationStateService } from './notification-state.service';

describe('NotificationStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationStateService]
    });
  });

  it('should be created', inject([NotificationStateService], (service: NotificationStateService) => {
    expect(service).toBeTruthy();
  }));
});
