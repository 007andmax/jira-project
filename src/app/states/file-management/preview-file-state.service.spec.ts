import { TestBed } from '@angular/core/testing';

import { PreviewFileStateService } from './preview-file-state.service';

describe('PreviewFileStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PreviewFileStateService = TestBed.get(PreviewFileStateService);
    expect(service).toBeTruthy();
  });
});
