export class MergeTickets {
    "ticketId": string;
    "isPrimary": boolean = false;
    "note": string;
    "noteType": string = "PUBLIC";
    subject: string;
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
    }
    public setNoteType(data) {
        this.noteType = data;
    }
}