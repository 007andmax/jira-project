import { TestBed, inject } from '@angular/core/testing';

import { TerminalStateService } from './terminal-state.service';

describe('TerminalStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TerminalStateService]
    });
  });

  it('should be created', inject([TerminalStateService], (service: TerminalStateService) => {
    expect(service).toBeTruthy();
  }));
});
