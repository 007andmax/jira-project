import { HelpCenterSubCategory } from "./help-center-sub-category";

export class HelpCenterCategory {
    id: string;
    name: string;
    subcategories: Array<HelpCenterSubCategory> = [];
    constructor(id, name, subcategories) {
        this.id = id;
        this.name = name;
        this.subcategories = subcategories;
    }
}