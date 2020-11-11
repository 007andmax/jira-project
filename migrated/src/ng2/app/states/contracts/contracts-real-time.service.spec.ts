import { TestBed } from '@angular/core/testing';

import { ContractsRealTimeService } from './contracts-real-time.service';

describe('ContractsRealTimeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContractsRealTimeService = TestBed.get(ContractsRealTimeService);
    expect(service).toBeTruthy();
  });
});
