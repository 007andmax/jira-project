import { TestBed, inject } from '@angular/core/testing';

import { CustomerRoleStateService } from './customer-role-state.service';

describe('CustomerRoleStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerRoleStateService]
    });
  });

  it('should be created', inject([CustomerRoleStateService], (service: CustomerRoleStateService) => {
    expect(service).toBeTruthy();
  }));
});
