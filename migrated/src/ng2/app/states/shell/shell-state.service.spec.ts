import { TestBed } from '@angular/core/testing';

import { ShellStateService } from './shell-state.service';

describe('ShellStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShellStateService = TestBed.get(ShellStateService);
    expect(service).toBeTruthy();
  });
});
