import { TestBed, inject } from '@angular/core/testing';

import { ModalImageCropperStateService } from './modal-image-cropper-state.service';

describe('ModalImageCropperStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModalImageCropperStateService]
    });
  });

  it('should be created', inject([ModalImageCropperStateService], (service: ModalImageCropperStateService) => {
    expect(service).toBeTruthy();
  }));
});
