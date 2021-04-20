import { TestBed } from '@angular/core/testing';

import { LeftPanelStateService } from './left-panel-state.service';

describe('LeftPanelStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LeftPanelStateService = TestBed.get(LeftPanelStateService);
    expect(service).toBeTruthy();
  });
});
