export class ModalLockValidate {
    wrongCode: boolean = true;
    validate: boolean = true;
    constructor() { }

    public getWrongCode() {
        return this.wrongCode;
    }
    public setWrongCode(data) {
        this.wrongCode = data;
    }
    public setValidate(data) {
        this.validate = data;
    }
    public getValidate() {
        this.validate;
    }
    public isValidate(code) {
        if (code.length === 0) this.validate = false;
        return this.validate;
    }
}