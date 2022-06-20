import { ReportsLeftMenuItemReport } from "./reports-left-menu-item-report";

export class ReportsLeftMenuItem {
    icon: string;
    category: string;
    subcategories: Array<ReportsLeftMenuItemReport> = [];
    permissions: boolean = true;
    constructor(icon, category, subcategories, permissions = true) {
        this.icon = icon;
        this.category = category;
        this.subcategories = subcategories;
        this.permissions = permissions;
    }
}