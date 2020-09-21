import { DefaultServiceValidate } from '../../../../default-services/class/default-service-validate';

export class ContractsHourlyAddDefaultServiceValidate extends DefaultServiceValidate {
    validate:boolean = true;

    public setName(data) {
        this.name = data;
    }
    public resetValidate() {
        this.validate = true;
    }
    public setValidate(data) {
        this.validate = data;
    }
    public getValidate() {
        return this.validate;
    }
}