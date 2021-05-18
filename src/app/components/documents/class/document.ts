import { CurrentUser } from "src/class/current-user/current-user";
import { DocumentLinked } from "./document-linked";

export class Document {
    categoryId: string;
    categoryName: string;
    clientType: string;
    createdAt: string;
    createdBy: string;
    description: string;
    documentType: string;
    id: string;
    linked: DocumentLinked;
    reviewDate: string;
    tags: []
    title: string;
    updatedAt: string;
    constructor(data) {
        this.categoryId = data.categoryId;
        this.categoryName = data.categoryName;
        this.clientType = data.clientType;
        this.createdAt = data.createdAt;
        this.createdBy = data.createdBy;
        this.description = data.description;
        this.documentType = data.documentType;
        this.id = data.id;
        this.linked = data.linked;
        this.reviewDate = data.reviewDate;
        this.tags = data.tags;
        this.title = data.title;
        this.updatedAt = data.updatedAt;
    }
}