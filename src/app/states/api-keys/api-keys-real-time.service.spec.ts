import { TestBed } from '@angular/core/testing';

import { ApiKeysRealTimeService } from './api-keys-real-time.service';

describe('ApiKeysRealTimeService', () => {
  let service: ApiKeysRealTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiKeysRealTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
