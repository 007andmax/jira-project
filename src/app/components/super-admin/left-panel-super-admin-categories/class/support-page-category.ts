export class SupportPageCategory {
    id: string;
    name: string;
    order: number;
    parentSupportCategoryId: string;
    subcategories: [];
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.order = data.order;
        this.parentSupportCategoryId = data.parentSupportCategoryId;
        this.subcategories = data.subcategories;
    }
}