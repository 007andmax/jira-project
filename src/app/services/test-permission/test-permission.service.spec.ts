import { TestBed, inject } from '@angular/core/testing';

import { TestPermissionService } from './test-permission.service';

describe('TestPermissionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestPermissionService]
    });
  });

  it('should be created', inject([TestPermissionService], (service: TestPermissionService) => {
    expect(service).toBeTruthy();
  }));
});
