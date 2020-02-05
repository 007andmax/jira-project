import { TestBed, inject } from '@angular/core/testing';

import { LeftPanelUsersService } from './left-panel-users.service';

describe('LeftPanelUsersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeftPanelUsersService]
    });
  });

  it('should be created', inject([LeftPanelUsersService], (service: LeftPanelUsersService) => {
    expect(service).toBeTruthy();
  }));
});
