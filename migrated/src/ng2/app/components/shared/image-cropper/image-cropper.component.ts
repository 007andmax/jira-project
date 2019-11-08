import { Component, OnInit, Input } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {ImageCropperStateService } from 'src/ng2/app/states/image-cropper/image-cropper-state.service';
import { CompaniesService } from 'src/ng2/app/services/company/companies.service';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  @Input() public imageBase64 = null;
  constructor( public activeModal: NgbActiveModal, private imageCropperStateService: ImageCropperStateService, private companiesService:CompaniesService) { }

  ngOnInit() {
   
  }
 
  
  fileChangeEvent(event: any): void {
      this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    console.log('event',event);
      this.croppedImage = event;
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
    this.activeModal.close();
    this.companiesService.uploadAvatar(btoa(this.imageBase64)).subscribe((data) => {
console.log('data',data);
    })
 //  this.imageCropperStateService.setConfirm(this.croppedImage);

  };
}
