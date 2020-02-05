import { TestBed, inject } from '@angular/core/testing';

import { UsersAsideService } from './users-aside.service';

describe('UsersAsideService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsersAsideService]
    });
  });

  it('should be created', inject([UsersAsideService], (service: UsersAsideService) => {
    expect(service).toBeTruthy();
  }));
});
