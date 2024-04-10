import { ManufactureDevice } from "./manufacture-device";

export class ModelDevice extends ManufactureDevice {
    isInitEdit: boolean = false;
    public onInitEdit(data) {
        this.isInitEdit = data;
    }
    public getDataModelForEdit(manufacturerId) {
        return {
            "name": this.name,
            "manufacturerId": manufacturerId,
            "id": this.id
        }
    }
}