import { TestBed } from '@angular/core/testing';

import { DownloadAgentService } from './download-agent.service';

describe('DownloadAgentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DownloadAgentService = TestBed.get(DownloadAgentService);
    expect(service).toBeTruthy();
  });
});
