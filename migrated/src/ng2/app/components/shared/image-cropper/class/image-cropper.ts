import { ImageCroppedEvent } from 'ngx-image-cropper';

export class ImageCropper {
    croppedImage: ImageCroppedEvent;
    id: string;
    constructor(croppedImage, id) {
        this.croppedImage = croppedImage;
        this.id = id;
    }
}