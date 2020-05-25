import { TestBed } from '@angular/core/testing';

import { TicketsPermissionsService } from './tickets-permissions.service';

describe('TicketsPermissionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TicketsPermissionsService = TestBed.get(TicketsPermissionsService);
    expect(service).toBeTruthy();
  });
});
