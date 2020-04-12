import { TestBed } from '@angular/core/testing';

import { UsersStateService } from './users-state.service';

describe('UsersStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UsersStateService = TestBed.get(UsersStateService);
    expect(service).toBeTruthy();
  });
});
