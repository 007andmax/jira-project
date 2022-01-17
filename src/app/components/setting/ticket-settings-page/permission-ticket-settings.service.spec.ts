import { TestBed, inject } from '@angular/core/testing';

import { PermissionTicketSettingsService } from './permission-ticket-settings.service';

describe('PermissionTicketSettingsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermissionTicketSettingsService]
    });
  });

  it('should be created', inject([PermissionTicketSettingsService], (service: PermissionTicketSettingsService) => {
    expect(service).toBeTruthy();
  }));
});
