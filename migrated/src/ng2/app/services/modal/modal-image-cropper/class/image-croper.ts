export class ImageCroper {
    imageBase64: string;
    id: string;
    edit:boolean;
    constructor(imageBase64, id,edit = false) {
        this.imageBase64 = imageBase64;
        this.id = id;
        this.edit = edit;
    }
}