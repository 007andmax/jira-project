import { DefaultServices } from './default-service';

export class DefaultServiceValidate {
    name: boolean = true;
    rate:boolean = true;
    constructor() {

    }
    public getName() {
        return this.name;
    }
    public getRate () {
        return this.rate;
    }

    public resetRate() {
        this.rate = true;
    }

    public resetName () {
        this.name = true;
    }
    public isValidate(service: DefaultServices) {
        if (service.name == "") this.name = false;
        if (service.rate < 0) this.rate = false;
        return this.rate && this.name;
    }
}