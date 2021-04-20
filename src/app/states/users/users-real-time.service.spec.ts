import { TestBed, inject } from '@angular/core/testing';

import { UsersRealTimeService } from './users-real-time.service';

describe('UsersRealTimeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsersRealTimeService]
    });
  });

  it('should be created', inject([UsersRealTimeService], (service: UsersRealTimeService) => {
    expect(service).toBeTruthy();
  }));
});
