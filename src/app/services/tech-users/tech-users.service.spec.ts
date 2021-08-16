import { TestBed } from '@angular/core/testing';

import { TechUsersService } from './tech-users.service';

describe('TehUsersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TechUsersService = TestBed.get(TechUsersService);
    expect(service).toBeTruthy();
  });
});
