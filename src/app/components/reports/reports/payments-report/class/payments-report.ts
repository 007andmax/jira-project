import { PaymentsReportPayments } from "./payments-report-payments";
import { PaymentsReportTotal } from "./payments-report-total";
import * as moment from "moment";

export class PaymentsReport {
    startDate: string = '';
    endDate: string = '';
    payments: PaymentsReportPayments;
    totalSumsPerPaymentMethod: PaymentsReportTotal;
    constructor() { }

    public setDataFromRequest(data) {
        this.payments = new PaymentsReportPayments(data.payments);
        this.totalSumsPerPaymentMethod = new PaymentsReportTotal(data.totalSumsPerPaymentMethod);
    }
    public setData(data) {
        this.startDate = data.startDate;
        this.endDate = data.endDate;
        this.payments = data.payments;
        this.totalSumsPerPaymentMethod = data.totalSumsPerPaymentMethod;
    }
    public getForRequest() {
        return {
            startDate: this.startDate,
            endDate: this.endDate,
        };
    }
    public setStartDate(startDate) {
        this.startDate = startDate;
    };
    public setEndDate(endDate) {
        this.endDate = endDate;
    };
}