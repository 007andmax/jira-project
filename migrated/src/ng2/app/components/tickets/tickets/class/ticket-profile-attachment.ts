import { TicketProfileAttachmentFile } from './ticket-profile-attachment-file';

export class TicketProfileAttachment {
    file: TicketProfileAttachmentFile;
    id: string;
    constructor(data) {
        this.file = new TicketProfileAttachmentFile(data.file);
        this.id = data.id;
    }
}