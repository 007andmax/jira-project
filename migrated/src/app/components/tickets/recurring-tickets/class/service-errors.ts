export class ServiceErrors {
    id: string;
    errors: Array<String>;
    constructor(_id, _errors) {
        this.id = _id;
        this.errors = _errors;
    }

}