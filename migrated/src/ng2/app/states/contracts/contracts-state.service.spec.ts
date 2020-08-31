import { TestBed } from '@angular/core/testing';

import { ContractsStateService } from './contracts-state.service';

describe('ContractsStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContractsStateService = TestBed.get(ContractsStateService);
    expect(service).toBeTruthy();
  });
});
