export class BreadcrumbsItem {
    name: string;
    parentCategoryId: string;
    companyId: string;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }
    }
}