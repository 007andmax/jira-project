export class DocumentFilter {
    categoryId: string;
    tags: Array<string> = [];
    userId: string;
    reviewDateStart: string;
    reviewDateEnd: string;
    companyId: string;
    constructor() {

    }
    public setCategoryId(data) {
        this.categoryId = data;
    }
}