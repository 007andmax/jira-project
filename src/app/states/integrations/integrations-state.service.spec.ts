import { TestBed } from '@angular/core/testing';

import { IntegrationsStateService } from './integrations-state.service';

describe('IntegrationsStateService', () => {
  let service: IntegrationsStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntegrationsStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
