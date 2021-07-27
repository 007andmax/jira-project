import { DocumentAdd } from "./document-add";

export class DocumentValidate {
    tittle: boolean = true;
    uniqueTittle: boolean = true;
    constructor() { }

    public getTitle() {
        return this.tittle;
    }
    public resetTitle() {
        this.tittle = true;
    }
    public setTitle(data) {
        this.tittle = data;
    }

    public getUniqueTittle() {
        return this.uniqueTittle;
    }
    public resetUniqueTittle() {
        this.uniqueTittle = true;
    }
    public setUniqueTittle(data) {
        this.uniqueTittle = data;
    }

    public isValidate(document) {
        if (document.title.length === 0) this.tittle = false;
        return this.tittle && this.uniqueTittle;
    }
}