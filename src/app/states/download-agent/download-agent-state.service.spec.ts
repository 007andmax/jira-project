import { TestBed } from '@angular/core/testing';

import { DownloadAgentStateService } from './download-agent-state.service';

describe('DownloadAgentStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DownloadAgentStateService = TestBed.get(DownloadAgentStateService);
    expect(service).toBeTruthy();
  });
});
