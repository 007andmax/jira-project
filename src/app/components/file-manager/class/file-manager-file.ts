import { Tag } from "src/app/interfaces/tag/tag";

export class FileManagerFile {
    "id": string;
    "mediaFileId": string;
    "description": string;
    "categoryId": string;
    "companyId": string;
    "name": string;
    "createdAt": number;
    "tags": Array<Tag> = [];
    "url": string;
    contentType: string;
    "uploaderEmail": string;
    "uploaderName": string;
    "updatedBy": string;
    "updatedAt": string;
    thumbnailUrl: string;
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
    public getDataForUpate(isChangefile = false) {
        let data: any = {
            "name": this.name,
            "description": this.description,
            "tags": this.tags.map(item => ({ id: item.id })),
            "categoryId": this.categoryId,
        }
        if (isChangefile) data.mediaFileId = this.mediaFileId;
        return data
    }
    public parseCreatedAt() {
        return (this.createdAt) ? this.createdAt : '';
    }
}