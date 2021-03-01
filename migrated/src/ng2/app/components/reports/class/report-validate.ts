export class ReportValidate {
    dates: boolean = true;
    monthlyDetailed: boolean = true;
    company: boolean = true;
    techUser: boolean = true;
    constructor() { }
    public getDates() {
        return this.dates;
    }
    public getTechUser() {
        return this.techUser;
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
    public resetTechUser() {
        this.techUser = true;
    }
    public resetMonthlyDetailed() {
        this.monthlyDetailed = true;
    }
    public isValidateCustomers(start, end, company, type) {
        if (type === 'Summary' && start === '' && end === '') {
            this.dates = false;
        }
        if (type === 'Detailed' && start === '' && end === '') this.dates = false;
        if (type === 'Detailed' && !company) this.company = false;
        return this.dates && this.company;
    }
    public isValidateDetailedCommissions(techUser) {
        if (!techUser) this.techUser = false;
        return this.techUser;
    }
    public isValidateCommonCommissions(techUser) {
        if (!techUser) this.techUser = false;
        return this.techUser;
    }
    public isValidateProduct(start, end, company, type) {
        if (type === 'Summary' && start === '' && end === '') {
            this.dates = false;
        }
        if (type === 'Detailed' && start === '' && end === '') this.dates = false;
        if (type === 'Detailed' && !company) this.company = false;
        return this.dates && this.company;
    }
    public getCompany() {
        return this.company;
    }

    public isValidateTickets(company) {
        if (!company) this.company = false;
        return this.company;
    }

    public isValidateService(company) {
        if (!company) this.company = false;
        return this.company;
    }
    public isValidateTaxes(start, end) {
        if (start === '' && end === '') {
            this.dates = false;
        }
        return this.dates;
    }

    public isValidate(detailed, yearToDate, start, end) {
        if (!detailed && !yearToDate && start === '' && end === '') {
            this.dates = false;
            this.monthlyDetailed = false;
        }
        return this.dates && this.monthlyDetailed;

    }
    public isValidateTechService(start, end) {
        if (start === '' && end === '') this.dates = false;
        return this.dates;
    }
    public isValidateAccounting(start, end, company) {
        if (start === '' && end === '') this.dates = false;
        if (!company) this.company = false;
        return this.dates && this.company;
    }
    public isValidateSoftwareSummary(company) {

        if (!company) this.company = false;
        return this.company;
    }
    public isValidateHardwareSummary(company) {

        if (!company) this.company = false;
        return this.company;
    }
}