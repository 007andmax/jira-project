export class ReportValidate {
    dates: boolean = true;
    monthlyDetailed: boolean = true;
    company: boolean = true;
    constructor() { }
    public getDates() {
        return this.dates;
    }
    public geMonthlyDetailed() {
        return this.monthlyDetailed;
    }

    public resetDates() {
        this.dates = true;
    }
    public resetCompany() {
        this.company = true;
    }

    public resetMonthlyDetailed() {
        this.monthlyDetailed = true;
    }
    public isValidateCustomers(start, end,company,type) {
        if (type === 'Summary' && start === '' && end === '') {
            this.dates = false;
        } 
        console.log("company",company);
        if (type === 'Detailed' && start === '' && end === '' )  this.dates = false;
        if (type === 'Detailed' && !company )  this.company = false;
        return this.dates && this.company;
    }
    public isValidateProduct(start, end,company,type) {
        if (type === 'Summary' && start === '' && end === '') {
            this.dates = false;
        } 
        console.log("company",company);
        if (type === 'Detailed' && start === '' && end === '' )  this.dates = false;
        if (type === 'Detailed' && !company )  this.company = false;
        return this.dates && this.company;
    }
    public getCompany() {
        return this.company;
    }
    public isValidateTaxes(start, end) {
        if (start === '' && end === '') {
            this.dates = false;
        }
        return this.dates;
    }

    public isValidate(detailed, yearToDate, start, end) {

        // if (detailed  && start === '' && end === '') this.dates = false;

        if (!detailed && !yearToDate && start === '' && end === '') {
            this.dates = false;
            this.monthlyDetailed = false;
        }
        return this.dates && this.monthlyDetailed;

    }
}