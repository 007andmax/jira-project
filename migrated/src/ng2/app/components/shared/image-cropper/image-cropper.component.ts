import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NgbActiveModal, NgbModalConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ImageCropperStateService } from 'src/ng2/app/states/image-cropper/image-cropper-state.service';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';
import { ImageCropper } from './class/image-cropper';
 

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class ImageCropperComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  img: any = '';
  @Input() public edit:boolean = false;
  @Input() public id = null;
  imageBase64 = '';
  @Input() public data = '';
  constructor(public activeModal: NgbActiveModal,public cd: ChangeDetectorRef,
     private imageCropperStateService: ImageCropperStateService, private companiesService: CompaniesService,  config: NgbModalConfig,) { 
      console.log('4444444444444444',this.imageBase64);
      this.cd.detectChanges();
    config.backdrop = 'static';
    config.keyboard = false;
     }

  ngOnInit() {
//this.cd.detectChanges();
console.log('3333333333333333');
  }


  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event;
    this.img = event.base64;
  }
  imageLoaded() {
    console.log('4444444444444444',this.imageBase64);
    this.cd.detectChanges();
  }
  closeModal() {
    this.activeModal.close();
    this.imageCropperStateService.setConfirm(null);
  }

  cancelConfirm() {
    this.activeModal.close();
    this.imageCropperStateService.setConfirm(null);
  };

  approveConfirm() {
    console.log('approveConfirm');
    this.activeModal.close();
     this.imageCropperStateService.setConfirm(new ImageCropper(this.croppedImage,this.id,this.edit));

  };



}
