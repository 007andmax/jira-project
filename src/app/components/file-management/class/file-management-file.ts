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
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
    }
}