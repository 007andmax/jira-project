import { Tag } from "src/app/interfaces/tag/tag";
import { DocumentAddLinked } from "./document-add-linked";

export class DocumentAdd {

    title: string = "";;
    content: string;
    categoryId: string;
    description: string;
    documentType: string;
    clientType: string;
    reviewDate: string;
    tags: Array<Tag> = [];
    linked: DocumentAddLinked = new DocumentAddLinked();
    constructor() {

    }
    public getDataForAdd() {
        return {
            title: this.title,
            content: this.content,
            categoryId: this.categoryId,
            description: (this.description && this.description.length > 0) ? this.description : undefined,
            documentType: this.documentType,
            clientType: this.clientType,
            reviewDate: this.reviewDate,
            tags: this.tags.map((item: any) => {
                return { id: item.id }
            }),
            linked: this.linked,
        }
    }
    public getDataForAdByTemplate(templateId, clientCompanyId) {
        return {
            title: this.title,
            content: this.content,
            categoryId: this.categoryId,
            description: (this.description && this.description.length > 0) ? this.description : undefined,
            documentType: this.documentType,
            clientType: this.clientType,
            reviewDate: this.reviewDate,
            tags: this.tags.map((item: any) => {
                return { id: item.id }
            }),
            templateId: templateId,
            clientCompanyId: clientCompanyId,
            linked: this.linked,
        }
    }
    public setData(data) {
        this.title = data.title;
        this.content = data.content;
        this.categoryId = data.categoryId;
        this.description = data.description;
        this.documentType = data.documentType;
        this.clientType = data.clientType;
        this.reviewDate = data.reviewDate;
        this.tags = data.tags;
        this.linked = data.linked;
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
    public parseReviewDate() {
        return new Date(this.reviewDate).getTime();
    }
}