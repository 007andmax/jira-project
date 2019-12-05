export class ImageCroper {
    imageBase64: string;
    id: string;
    constructor(imageBase64, id) {
        this.imageBase64 = imageBase64;
        this.id = id;
    }
}