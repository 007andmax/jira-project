import { ReportsLeftMenuItemReport } from "./reports-left-menu-item-report";

export class ReportsLeftMenuItem {
    icon: string;
    category: string;
    subcategories: Array<ReportsLeftMenuItemReport> = [];
    permissions: string;
    constructor(icon, category, subcategories, permissions = null) {
        this.icon = icon;
        this.category = category;
        this.subcategories = subcategories;
        this.permissions = permissions;
    }
}