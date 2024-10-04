export class AccountsReceivableItem {
    value: string;
    class: string;
    constructor(value, clas = null) {
        this.value = value;
        this.class = clas;
    }
}