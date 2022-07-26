export class NoteTemplate {
    id: string;
    title: string = "";
    note: string = "";
    active: boolean;
    editMode: boolean = false;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }

    }
    public getEditMode() {
        return this.editMode;
    }
    public setEditMode(data) {
        this.editMode = data;
    }
    public getDataForRequest() {
        return {
            title: this.title,
            note: this.note,
            active: this.active
        }
    }
}