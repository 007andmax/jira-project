export class SupportPageCategoryContent {
    type: string;
    document: {
        id: string;
        content: string;
    };
    createdAt: string = "";
    createdBy: string = "";
    tagIds: Array<string> = [];
    newContent: string;
    isEditMode: boolean = false;
    tags: Array<any> = [];
    constructor() {

    }
    public setIdDocument(data) {
        this.document.id = data;
    }
    public setContent(data) {
        if (data && data.document) {
            this.document = {
                id: data.document.id,
                content: data.document.content
            }
            this.createdAt = data.document.createdAt;
            this.createdBy = data.document.createdBy;
            this.newContent = JSON.parse(JSON.stringify(data.document.content));
        } else {
            this.document = {
                id: "",
                content: "",
            }
            this.newContent = "";
        }
    }
    public setType(data) {
        this.type = data;
    }
    public getData() {
        if (this.isEditMode) {
            let document = null;
            if (this.newContent != this.document.content) document = {
                id: this.document.id,
                content: this.newContent,
            }
            return {
                type: this.type,
                document: document,
                tagIds: this.tagIds
            }
        }
        return {
            type: this.type,
            document: {
                content
                    : this.newContent
            },
            tagIds: this.tagIds
        }
    }
    public setEditMode(data) {
        this.isEditMode = data;
    }
    public setIdTags(data) {
        this.tagIds = data;
    }
    public setTags(data) {
        this.tags = data;
    }
    public setNewContent(data) {
        this.newContent = data;
    }

}