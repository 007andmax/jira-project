import { TestBed } from '@angular/core/testing';

import { CompaniesListService } from './companies-list.service';

describe('CompaniesListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompaniesListService = TestBed.get(CompaniesListService);
    expect(service).toBeTruthy();
  });
});
