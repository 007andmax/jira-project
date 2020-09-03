import { ContractsHourly } from './contracts-hourly';

export class ContractsHourlyValidate {
    description: boolean = true;
    date: boolean = true;
    constructor() {

    }
    public resetDate() {
        this.date = true;
    }
    public getDate() {
        return this.date;
    }
    public setDate(data) {
        this.date = data;
    }
    public getDescription() {
        return this.description;
    }
    public resetDescription() {
        this.description = true;
    }
    public isValidate(contractsHourly: ContractsHourly) {
        if (contractsHourly.description === "") this.description = false;
       
        return this.description;
    }
}