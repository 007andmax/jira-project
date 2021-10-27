export class TicketStatus {
    color: number;
    custom: boolean;
    id: string;
    name: string;
    constructor(data) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }

        }
    }
    public getDataForEdit(name, color) {
        if (!this.custom) {
            return {
                id: this.id,
                color: color
            }
        }
        return {
            id: this.id,
            name: name,
            color: color
        }
    }
}