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
    constructor() {

    }
    public setContent(data) {
        if (data) {
            this.document = {
                id: data.id,
                content: data.content
            }
            this.createdAt = data.createdAt;
            this.createdBy = data.createdBy;
        } else {
            this.document = {
                id: "",
                content: "",
            }
        }
    }
    public setType(data) {
        this.type = data;
    }
    public getData() {
        if (this.isEditMode) {
            let document;
            if (this.newContent) document = {
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
                    : this.document.content
            },
            tagIds: this.tagIds
        }
    }
    public setEditMode(data) {
        this.isEditMode = data;
    }

}