export class DeviceType {
    id: number;
    name: string;
    selected: boolean = false;
    isInitEdit: boolean = false;
    isInitRequest: boolean = false;
    disableUpdate: boolean = false;
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
    public setIsInitRequest(data) {
        this.isInitRequest = data;
    }
    public onInitEdit(data) {
        this.isInitEdit = data;
    }
    public getDataForEdit() {
        return {
            id: this.id,
            name: this.name,
        };
    }
    public checkDublicate(list) {
        var duplicate = list.filter((item) => {
            return item.name.toLowerCase() === this.name.toLowerCase() && item.id !== this.id;
        });
        if (duplicate && duplicate[0]) {
            return this.disableUpdate = true;
        } else {
            return this.disableUpdate = false;
        }
    };
}