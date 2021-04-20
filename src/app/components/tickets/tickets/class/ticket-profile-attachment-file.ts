export class TicketProfileAttachmentFile {
    contentType: string;
    createdAt: number;
    deletedAt: number;
    handler: any;
    hibernateLazyInitializer: any;
    id: string;
    isDarkCorner: boolean;
    isOpened: boolean;
    linkId: string;
    linkType: string;
    name:string;
    size: number;
    updatedAt: number;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                    this[key] = data[key];
            }
        }
     }
}