export class ManufactureDevice {
    "id": number;
    "name": string;
    selected: boolean = false;
    isInitEdit: boolean = false;
    isInitRequest: boolean = false;
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
    }
    public setIsInitRequest(data) {
        this.isInitRequest = data;
    }
    public onInitEdit(data) {
        this.isInitEdit = data;
    }
    public getDataForEdit() {
        return {
            "name": this.name,
            "id": this.id
        }
    }
}