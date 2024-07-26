export class FileManagementCategory {
    "id": string;
    "name": string;
    "parentCategoryId": string;
    "companyId": string;
    "subcategories": Array<FileManagementCategory>;
    "allCompaniesRoot": boolean;
    "customerCompanyRoot": boolean;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }
    }
}