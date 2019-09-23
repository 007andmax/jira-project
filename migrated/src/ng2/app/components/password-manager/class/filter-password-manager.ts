export class FilterPasswordManager {
    sort: string = 'companyName';
    direction: string = 'ASC';
    company:any;
    user:any;
    dateFormat:any;
    passwordCategory:any;
    constructor () {
        
    }
    public resetDirection() {
        this.direction = null;
    }
}