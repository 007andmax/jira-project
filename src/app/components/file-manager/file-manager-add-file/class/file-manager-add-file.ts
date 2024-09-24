export class FileManagerAddFile {
    "name": string;
    "description": string;
    "mediaFileId": string;
    "tags": Array<string> = [];
    "companyId": string;
    "categoryId": string;
    constructor() {

    }
    public setCategoryId(data) {
        this.categoryId = data;
    }
    public setMediaFileId(data) {
        this.mediaFileId = data;
    }
    public setTags(data) {
        this.tags = data;
    }
}