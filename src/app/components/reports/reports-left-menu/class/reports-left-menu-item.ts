import { ReportsLeftMenuItemReport } from "./reports-left-menu-item-report";

export class ReportsLeftMenuItem {
    icon: string;
    category: string;
    subcategories: Array<ReportsLeftMenuItemReport> = [];
    constructor(icon, category, subcategories) {
        this.icon = icon;
        this.category = category;
        this.subcategories = subcategories;
    }
}