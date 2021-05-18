import { TestBed, inject } from '@angular/core/testing';

import { DocumentsStateService } from './documents-state.service';

describe('DocumentsStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DocumentsStateService]
    });
  });

  it('should be created', inject([DocumentsStateService], (service: DocumentsStateService) => {
    expect(service).toBeTruthy();
  }));
});
