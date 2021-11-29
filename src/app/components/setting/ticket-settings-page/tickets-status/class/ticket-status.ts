export class TicketStatus {
    color: number = 0;
    custom: boolean;
    id: string;
    name: string = "";
    isInitEdit: boolean = false;
    selected: boolean = false;
    disableCreate: boolean = false;
    disableUpdate: boolean = false;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }

        }
    }
    checkDublicate(list) {
        var duplicate = list.filter((item) => {
            return item.name.toLowerCase() === this.name.toLowerCase();
        });
        if (duplicate && duplicate[0]) {
            return this.disableCreate = true;
        } else {
            return this.disableCreate = false;
        }
    };
    checkDublicateUpdate(list) {
        var duplicate = list.filter((item) => {
            return item.name.toLowerCase() === this.name.toLowerCase() && item.id !== this.id;
        });
        if (duplicate && duplicate[0]) {
            return this.disableUpdate = true;
        } else {
            return this.disableUpdate = false;
        }
    };
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