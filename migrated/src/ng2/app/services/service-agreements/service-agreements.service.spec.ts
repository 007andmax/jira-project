import { TestBed } from '@angular/core/testing';

import { ServiceAgreementsService } from './service-agreements.service';

describe('ServiceAgreementsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServiceAgreementsService = TestBed.get(ServiceAgreementsService);
    expect(service).toBeTruthy();
  });
});
