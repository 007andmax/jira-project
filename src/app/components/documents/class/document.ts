import { Tag } from "src/app/interfaces/tag/tag";
import { DocumentLinked } from "./document-linked";

export class Document {
    categoryId: string;
    categoryName: string;
    clientType: string;
    createdAt: string;
    createdBy: string;
    description: string;
    content: string;
    documentType: string;
    id: string;
    linked: DocumentLinked;
    reviewDate: string;
    tags: Array<Tag> = [];
    title: string;
    updatedAt: string;
    isCategory: boolean = false;
    isDefault: boolean;
    constructor(data, isCategory = false) {
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
        this.content = data.content;
        this.isCategory = isCategory;
        this.isDefault = data.isDefault;
    }
    public getDataForEdit() {
        return {
            title: this.title,
            content: this.content,
            documentType: this.documentType,
            clientType: this.clientType,
            description: (this.description && this.description.length > 0) ? this.description : undefined,
            reviewDate: this.reviewDate,
            categoryId: this.categoryId,
            tags: this.tags.map((item: any) => {
                return { id: item.id }
            }),
            linked: this.linked
        }
    }
    public setLinked(users, companies) {
        this.linked.users = users;
        this.linked.companies = companies;
    }
    public setCategoryId(data) {
        this.categoryId = data;
    }
    public setTags(data) {
        this.tags = data;
    }
    public setClientType(data) {
        this.clientType = data;
    }
    public setReviewDate(data) {
        this.reviewDate = data;
    }
    public parseReviewDate() {
        return new Date(this.reviewDate).getTime();
    }
    public isTemplate() {
        return this.linked.companies.length === 0 && this.linked.users.length === 0;
    }
    public setContent(data) {
        this.content = data;
    }
    public isTemplateForEdit() {
        return this.documentType === 'TEMPLATE';
    }
}