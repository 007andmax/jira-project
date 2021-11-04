export class TicketStatus {
    color: number = 0;
    custom: boolean;
    id: string;
    name: string = "";
    isInitEdit: boolean = false;
    selected: boolean = false;
    constructor(data = null) {
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
    public onInitEdit(data) {
        this.isInitEdit = data;
    }

}