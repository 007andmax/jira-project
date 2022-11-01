import { TestBed, inject } from '@angular/core/testing';

import { SignatureStateService } from './signature-state.service';

describe('SignatureStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SignatureStateService]
    });
  });

  it('should be created', inject([SignatureStateService], (service: SignatureStateService) => {
    expect(service).toBeTruthy();
  }));
});
