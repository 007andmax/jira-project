import { TestBed } from '@angular/core/testing';

import { ApiKeysStateService } from './api-keys-state.service';

describe('ApiKeysStateService', () => {
  let service: ApiKeysStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiKeysStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
