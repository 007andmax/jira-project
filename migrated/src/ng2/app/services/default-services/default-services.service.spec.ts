import { TestBed } from '@angular/core/testing';

import { DefaultServicesService } from './default-services.service';

describe('DefaultServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DefaultServicesService = TestBed.get(DefaultServicesService);
    expect(service).toBeTruthy();
  });
});
