import { TestBed, inject } from '@angular/core/testing';

import { AddUsersNotifyStateService } from './add-users-notify-state.service';

describe('AddUsersNotifyStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddUsersNotifyStateService]
    });
  });

  it('should be created', inject([AddUsersNotifyStateService], (service: AddUsersNotifyStateService) => {
    expect(service).toBeTruthy();
  }));
});
