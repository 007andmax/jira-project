export class CompanySubscription {
    title:string;
    field:string;
    selected:boolean  =false;
    constructor (title,field) {
        this.title = title;
        this.field = field;
    }
}