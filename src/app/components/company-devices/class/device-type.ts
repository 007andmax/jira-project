export class DeviceType {
    id: number;
    name: string;
    selected: boolean = false;
    isInitEdit: boolean = false;
    isInitRequest: boolean = false;
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
}