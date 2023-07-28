import { TestBed, inject } from '@angular/core/testing';

import { CustomerRoleRealTimeService } from './customer-role-real-time.service';

describe('CustomerRoleRealTimeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerRoleRealTimeService]
    });
  });

  it('should be created', inject([CustomerRoleRealTimeService], (service: CustomerRoleRealTimeService) => {
    expect(service).toBeTruthy();
  }));
});
