import { TestBed, inject } from '@angular/core/testing';

import { LockScreenService } from './lock-screen.service';

describe('LockScreenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LockScreenService]
    });
  });

  it('should be created', inject([LockScreenService], (service: LockScreenService) => {
    expect(service).toBeTruthy();
  }));
});
