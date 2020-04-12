import { TestBed } from '@angular/core/testing';

import { TehUsersService } from './teh-users.service';

describe('TehUsersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TehUsersService = TestBed.get(TehUsersService);
    expect(service).toBeTruthy();
  });
});
