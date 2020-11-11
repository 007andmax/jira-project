export class ContractsFilterType {
    title:string;
    type: string;
    billType: string;
    constructor(title,type, billType) {
        this.title = title;
        this.type = type;
        this.billType = billType;
    }
}