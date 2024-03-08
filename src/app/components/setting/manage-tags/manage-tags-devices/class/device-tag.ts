export class DeviceTag {
    "id": number;
    "name": string;
    selected: boolean = false;
    isInitRequest: boolean = false;
    isInitEdit: boolean = false;
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
    }
    public setIsInitRequest(data) {
        this.isInitRequest = data;
    }
    public onInitEdit(data) {
        this.isInitEdit = data;
    }
}