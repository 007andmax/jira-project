export class DocumentAdd {
    title: string;
    content: string;
    documentCategory: string;
    documentType: string;
    clientType: string;
    constructor() {
        this.title = "First document";

        this.documentCategory = "test category";
        this.documentType = "DOCUMENT";
        this.clientType = "CLIENT";
    }
    public setContent(data) {
        this.content = data;
    }
}