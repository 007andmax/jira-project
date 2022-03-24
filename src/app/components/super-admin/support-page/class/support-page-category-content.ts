export class SupportPageCategoryContent {
    type: string;
    document: {
        id: string;
        content: string;
    };
    tagIds: Array<string> = [];
    isEditMode: boolean = false;
    constructor() {

    }
    public setContent(data) {
        if (data) {

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

            return {
                type: this.type,
                document: {
                    content
                        : this.document.content
                },
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