import { TestBed, inject } from '@angular/core/testing';

import { UsersTableService } from './users-table.service';

describe('UsersTableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsersTableService]
    });
  });

  it('should be created', inject([UsersTableService], (service: UsersTableService) => {
    expect(service).toBeTruthy();
  }));
});
