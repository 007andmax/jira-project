import { SupportPageSubCategory } from "./support-page-sub-category";

export class SupportPageCategory {
    id: string;
    name: string;
    order: number;
    parentSupportCategoryId: string;
    subcategories: Array<SupportPageCategory> = [];
    type: string;
    toggleSubCategory: boolean = false;
    constructor(data) {
        this.onUpdate(data);
    }
    public onUpdate(data) {
        this.id = data.id;
        this.name = data.name;
        this.order = data.order;
        this.parentSupportCategoryId = data.parentSupportCategoryId;
        this.subcategories = (data.subcategories) ? data.subcategories.map(item => new SupportPageCategory(item)) : [];
        this.type = data.type;
    }
}