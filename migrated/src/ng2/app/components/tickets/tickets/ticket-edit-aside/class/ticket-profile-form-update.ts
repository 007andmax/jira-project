export class TicketProfileFormUpdate {
    note: string = "";
    type: string = "NOTE";
    shares = [];
    ticket: any;
    attachments: any = [];
    constructor() { }
    public setChatMessage(data) {
        this.note = data;
    }
    public getDataForUpdateNote() {
        return {
            note: this.note,
            type: this.type,
            shares: this.shares,
            ticket: this.ticket,
            attachments: this.attachments
        }
    }

    public isValidateNote() {
        return this.type === "NOTE" && this.note.length > 0;
    }
    public setTicketId (id) {
        this.ticket = { id:id};
    }
    public addFile(id) {
        this.attachments.push({file:{id:id}});
    }
    public removeFile(index) {
this.attachments.splice(index, 1);
    }
}