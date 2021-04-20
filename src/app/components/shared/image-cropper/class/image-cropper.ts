import { ImageCroppedEvent } from 'ngx-image-cropper';

export class ImageCropper {
    croppedImage: ImageCroppedEvent;
    id: string;
    edit:boolean = false;
    constructor(croppedImage, id,edit = false) {
        this.croppedImage = croppedImage;
        this.id = id;
        this.edit = edit;
    }
}