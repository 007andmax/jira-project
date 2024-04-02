export class ManufactureDevice {
    "id": number;
    "name": string;
    selected: boolean = false;
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
    }
}