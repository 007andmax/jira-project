export class ProductType {
    "id": string;
    "title": string;
    isInitEdit: boolean = false;
    disableUpdate: boolean = false;
    selected: boolean = false;
    isInitRequest: boolean = false;
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
    }
}