import { CurrentUser } from "src/class/current-user/current-user";

export class Document {
    id: string;
    title: string;
    documentCategory: string;
    documentType: string;
    clientType: string;
    createdBy: CurrentUser;
    createdAt: number;
    updatedAt: number;
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.documentCategory = data.documentCategory;
        this.documentType = data.documentType;
        this.clientType = data.clientType;
        this.createdBy = data.createdBy;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
}