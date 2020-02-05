import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalImageCropperComponent } from './modal-image-cropper.component';

describe('ModalImageCropperComponent', () => {
  let component: ModalImageCropperComponent;
  let fixture: ComponentFixture<ModalImageCropperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalImageCropperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalImageCropperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
