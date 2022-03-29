export class SupportPageInfoTag {
    id: string;
    word: string;
    editMode: boolean = false;
    constructor(data) {
        this.id = data.id;
        this.word = data.word;
    }
    public isEditMode() {
        return this.editMode;
    }
    public setEditMode(data) {
        this.editMode = data;
    }
}