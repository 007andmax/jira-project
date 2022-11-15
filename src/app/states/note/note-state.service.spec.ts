import { TestBed, inject } from '@angular/core/testing';

import { NoteStateService } from './note-state.service';

describe('NoteStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NoteStateService]
    });
  });

  it('should be created', inject([NoteStateService], (service: NoteStateService) => {
    expect(service).toBeTruthy();
  }));
});
