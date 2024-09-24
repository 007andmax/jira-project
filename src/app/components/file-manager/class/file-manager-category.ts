export class FileManagerCategory {
    "id": string;
    "name": string;
    "parentCategoryId": string;
    "companyId": string;
    "subcategories": Array<FileManagerCategory>;
    "allCompaniesRoot": boolean;
    "customerCompanyRoot": boolean;
    createdAt: string;
    creatorEmail: string;
    creatorName: string;
    "updatedBy": string;
    "updatedAt": string;
    uploaderEmail: string;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }
    }
    public setName(data) {
        this.name = data;
    }
    public getDataForUpate() {
        return {
            "name": this.name,
        }
    }
}