import { TestBed } from '@angular/core/testing';

import { ContractsListService } from './contracts-list.service';

describe('ContractsListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContractsListService = TestBed.get(ContractsListService);
    expect(service).toBeTruthy();
  });
});
