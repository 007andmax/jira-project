import { NoteTemplate } from "./note-template";

export class NoteTemplateValidate {
    title: boolean = true;
    note: boolean = true;
    titleIsExist: boolean = false;
    constructor() { }

    public getTitleIsExist() {
        return this.titleIsExist;
    }
    public setTitleIsExist(data) {
        this.titleIsExist = data;
    }
    public resetTitle() {
        this.title = true;
    }
    public resetNote() {
        this.note = true;
    }
    public getTitle() {
        return this.title;
    }
    public getNote() {
        return this.note;
    }
    public isValidate(noteTemplate: NoteTemplate) {
        if (noteTemplate.title.length < 1 || noteTemplate.title.length > 250) this.title = false;
        if (noteTemplate.note.length < 1 || noteTemplate.note.length > 5000) this.note = false;
        return this.title && this.note && !this.titleIsExist;

    }
}