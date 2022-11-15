import { TestBed, inject } from '@angular/core/testing';

import { NoteRealTimeService } from './note-real-time.service';

describe('NoteRealTimeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NoteRealTimeService]
    });
  });

  it('should be created', inject([NoteRealTimeService], (service: NoteRealTimeService) => {
    expect(service).toBeTruthy();
  }));
});
