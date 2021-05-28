import { DocumentAddLinked } from "./document-add-linked";

export class DocumentAdd {

    title: string = "";;
    content: string;
    categoryId: string;
    description: string;
    documentType: string;
    clientType: string;
    reviewDate: string;
    tags: Array<string> = [];
    linked: DocumentAddLinked = new DocumentAddLinked();
    constructor() {


    }
    public setDocumentType(data) {
        this.documentType = data;
    }
    public setLinked(users, companies) {
        this.linked.users = users;
        this.linked.companies = companies;
    }
    public setClientType(data) {
        this.clientType = data;
    }
    public setTags(data) {
        this.tags = data;
    }
    public setCategoryId(data) {
        this.categoryId = data;
    }
    public setReviewDate(data) {
        this.reviewDate = data;
    }
    public setContent(data) {
        this.content = data;
    }
    public isTemplate() {
        return this.linked.companies.length === 0 && this.linked.users.length === 0;
    }
}