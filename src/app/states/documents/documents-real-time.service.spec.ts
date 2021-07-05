import { TestBed, inject } from '@angular/core/testing';

import { DocumentsRealTimeService } from './documents-real-time.service';

describe('DocumentsRealTimeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DocumentsRealTimeService]
    });
  });

  it('should be created', inject([DocumentsRealTimeService], (service: DocumentsRealTimeService) => {
    expect(service).toBeTruthy();
  }));
});
