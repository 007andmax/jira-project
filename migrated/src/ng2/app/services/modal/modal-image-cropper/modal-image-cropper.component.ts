import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ImageCropperStateService } from 'src/ng2/app/states/image-cropper/image-cropper-state.service';
import { CompaniesService } from '../../company/companies.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ImageCropper } from 'src/ng2/app/components/shared/image-cropper/class/image-cropper';
import { ModalImageCropperStateService } from './services/modal-image-cropper-state.service';
import { ImageCroper } from './class/image-croper';
 
@Component({
  selector: 'modal-image-cropper',
  templateUrl: './modal-image-cropper.component.html',
  styleUrls: ['./modal-image-cropper.component.css']
})
export class ModalImageCropperComponent implements OnInit, OnDestroy {


  imageChangedEvent: any = '';
  croppedImage: any = '';
  img: any = '';
  public edit: boolean = false;
  public id = null;
  imageBase64 = '';
  show = false;
  @ViewChild('imageCroper') imageCroper;
  constructor(public cd: ChangeDetectorRef,
    private imageCropperStateService: ImageCropperStateService, private companiesService: CompaniesService,
    private modalImageCropperStateService: ModalImageCropperStateService,
    private elRef: ElementRef, ) {
    console.log('4444444444444444', this.imageBase64);

  }

  ngOnInit() {
    //this.cd.detectChanges();
    console.log('imageCroper', this.imageCroper);
    console.log('3333333333333333');
    this.modalImageCropperStateService.getOnOpen().subscribe((data:ImageCroper) => {
      this.imageBase64 = data.imageBase64;
      
      this.id = data.id;
      this.edit = data.edit;
    
      //  this.imageCroper.imageBase64 = data;
      this.elRef.nativeElement.querySelector('.modal-image-confirm').style.display = 'block';
      this.show = true;
      this.cd.detectChanges();
    })
  }


  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event;
    this.img = event.base64;
  }
  
  cropperReady() {
   
    if (!this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }
  closeModal() {
    
    this.show = false;
    this.elRef.nativeElement.querySelector('.modal-image-confirm').style.display = 'none';
  
  }

  cancelConfirm() {
   this.closeModal();
  };

  approveConfirm() {
    console.log('approveConfirm');
    //  this.activeModal.close();
  this.closeModal();
    this.imageCropperStateService.setConfirm(new ImageCropper(this.croppedImage, this.id, this.edit));
    

  };

  ngOnDestroy(): void {
    this.cd.detach(); // do this
  }

}
