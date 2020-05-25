import { TestBed } from '@angular/core/testing';

import { PreviewAttachmentStateService } from './preview-attachment-state.service';

describe('PreviewAttachmentStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PreviewAttachmentStateService = TestBed.get(PreviewAttachmentStateService);
    expect(service).toBeTruthy();
  });
});
