export class DocumentFilter {
    categoryId: string;
    tags: Array<string> = [];
    userId: string;
    reviewDateStart: string;
    reviewDateEnd: string;
    companyId: string;
    constructor() {

    }
    public isExistFilters() {
        return this.categoryId || this.tags.length > 0 || this.userId || this.reviewDateStart && this.reviewDateEnd || this.companyId;
    }
    public setFilters(data) {
        this.tags = data.tags;
        this.userId = data.userId;
        this.reviewDateStart = data.reviewDateStart;
        this.reviewDateEnd = data.reviewDateEnd;
        this.companyId = data.companyId;
    }
    public setCategoryId(data) {
        this.categoryId = data;
    }
    public setCompanyId(data) {
        this.companyId = data;
    }
    public setTags(data) {
        this.tags = data;
    }
    public setUserId(data) {
        this.userId = data;
    }
    public setReviewDateStart(data) {
        this.reviewDateStart = data;
    }
    public setReviewDateEnd(data) {
        this.reviewDateEnd = data;
    }
}