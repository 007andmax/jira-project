export class FileManagementAddFile {
    "name": string;
    "description": string;
    "mediaFileId": string;
    "tags": Array<string> = [];
    "companyId": string;
    "categoryId": string;
    constructor() {

    }
    public setMediaFileId(data) {
        this.mediaFileId = data;
    }
}