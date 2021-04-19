import { TestBed } from '@angular/core/testing';

import { PasswordManagerListService } from './password-manager-list.service';

describe('PasswordManagerListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PasswordManagerListService = TestBed.get(PasswordManagerListService);
    expect(service).toBeTruthy();
  });
});
