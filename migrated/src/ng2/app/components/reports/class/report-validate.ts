export class ReportValidate {
    dates: boolean = true;
    monthlyDetailed: boolean = true;
     
    constructor() { }
    public getDates(){
        return this.dates;
    }
    public geMonthlyDetailed(){
        return this.monthlyDetailed;
    }

    public resetDates() {
        this.dates = true;
    }

    public resetMonthlyDetailed () {
        this.monthlyDetailed = true;
    }
   
    public isValidate(detailed,yearToDate,start,end) {
       
       // if (detailed  && start === '' && end === '') this.dates = false;
       
        if (!detailed && !yearToDate  && start === '' && end === '')  {
            this.dates = false;
            this.monthlyDetailed = false;
        }
        return this.dates && this.monthlyDetailed;

    }
}