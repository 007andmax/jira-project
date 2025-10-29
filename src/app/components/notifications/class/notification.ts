export class Notification {
    "id": string;
    "date": number;
    "title": string;
    "type": string;
    "read": boolean;
    ticketId: string;
    saleQuoteId: string;
    date_text: string;
    relatedEntityDeleted: boolean;
    relatedEntityDeletedText: string;
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
        if (this.calculateLastUpdatedAt() < 3600000) {
            this.date_text = Math.floor(Math.abs(this.calculateLastUpdatedAt() / 60000)) + " mins ago";
        } else if (this.calculateLastUpdatedAt() < 3600000 * 24) {
            let hours = Math.floor(this.calculateLastUpdatedAt() / 3600000);
            let minutes = Math.round((this.calculateLastUpdatedAt() - (hours * 3600000)) / 60000);
            this.date_text = hours + "h " + minutes + " mins ago"
        } else {
            this.date_text = Math.floor(Math.abs(this.calculateLastUpdatedAt() / (3600000 * 24))) + " days ago";
        }
    }
    public calculateLastUpdatedAt() {
        var today = Date.now();
        var lastUpdatedAt = new Date(this.date).getTime();
        return (today - lastUpdatedAt);
    };
}