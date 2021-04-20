import { TestBed, inject } from '@angular/core/testing';

import { UsersHeaderService } from './users-header.service';

describe('UsersHeaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsersHeaderService]
    });
  });

  it('should be created', inject([UsersHeaderService], (service: UsersHeaderService) => {
    expect(service).toBeTruthy();
  }));
});
