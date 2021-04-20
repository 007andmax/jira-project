import { TestBed } from '@angular/core/testing';

import { DefaultServicesStateService } from './default-services-state.service';

describe('DefaultServicesStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DefaultServicesStateService = TestBed.get(DefaultServicesStateService);
    expect(service).toBeTruthy();
  });
});
