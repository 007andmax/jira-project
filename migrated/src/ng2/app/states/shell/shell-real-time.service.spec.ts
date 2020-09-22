import { TestBed } from '@angular/core/testing';

import { ShellRealTimeService } from './shell-real-time.service';

describe('ShellRealTimeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShellRealTimeService = TestBed.get(ShellRealTimeService);
    expect(service).toBeTruthy();
  });
});
