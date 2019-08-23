import { TestBed } from '@angular/core/testing';

import { AlertStateService } from './alert-state.service';

describe('AlertStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlertStateService = TestBed.get(AlertStateService);
    expect(service).toBeTruthy();
  });
});
