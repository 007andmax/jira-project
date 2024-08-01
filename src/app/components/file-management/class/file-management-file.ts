export class FileManagementFile {
    "id": string;
    "mediaFileId": string;
    "description": string;
    "categoryId": string;
    "companyId": string;
    "name": string;
    "createdAt": string;
    "tags": Array<string> = [];
    "url": string;
    contentType: string;
    "uploaderEmail": string;
    "uploaderName": string;
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
    }
    public setName(data) {
        this.name = data;
    }
    public setTags(data) {
        this.tags = data;
    }
    public getDataForUpate() {
        return {
            "name": this.name,
            "description": this.description,
            "tags": this.tags,
            "categoryId": this.categoryId
        }
    }
}