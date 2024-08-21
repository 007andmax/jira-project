export class BreadcrumbsItem {
    id: string;
    name: string;
    parentCategoryId: string;
    companyId: string;
    allCompaniesRoot: boolean;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }
    }
}