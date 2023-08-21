export class TicketsPriority {
    "id": string;
    "color": number = 0;
    "name": string = "";
    "isDefault": boolean;
    selected: boolean = false;
    disableCreate: boolean = false;
    disableUpdate: boolean = false;
    isInitEdit: boolean = false;
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
        return {
            name: name,
            color: color
        }
    }
    public onInitEdit(data) {
        this.isInitEdit = data;
    }
}