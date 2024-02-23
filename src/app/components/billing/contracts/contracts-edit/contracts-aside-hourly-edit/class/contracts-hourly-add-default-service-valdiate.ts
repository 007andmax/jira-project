import { NonContractServiceValidate } from '../../../../non-contract-services/class/non-contract-service-validate';

export class ContractsHourlyAddDefaultServiceValidate extends NonContractServiceValidate {
    validate: boolean = true;

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