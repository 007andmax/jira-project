import { TestBed } from '@angular/core/testing';

import { PasswordManagerStateService } from './password-manager-state.service';

describe('PasswordManagerStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PasswordManagerStateService = TestBed.get(PasswordManagerStateService);
    expect(service).toBeTruthy();
  });
});
