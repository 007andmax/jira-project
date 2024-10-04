import { ReportsLeftMenuItemReport } from "./reports-left-menu-item-report";

export class ReportsLeftMenuItem {

    category: string;
    subcategories: Array<ReportsLeftMenuItemReport> = [];
    permissions: string;
    constructor(category, subcategories, permissions = null) {
        this.category = category;
        this.subcategories = subcategories;
        this.permissions = permissions;
    }
}