import * as moment from 'moment';
import { InvoicesFilter } from '../../invoices/class/invoices-filter';
import { Payment } from './payment';

export class PaymentsFilter extends InvoicesFilter {
    companyId: string;


    public setCompanyId(data) {
        this.companyId = data;
    }
    public getFIlter() {
        let endDate = new Date(this.endDate);
        endDate.setDate(endDate.getDate() + 1);
        let data: any = {
            companyId: this.companyId,
            invoiceNumber: this.invoiceNumber,
            limit: this.limit,
            offset: (this.initLeftOffset) ? (this.offset - this.leftOffset) : this.offset,
            sortBy: this.sortBy,
            status: this.status,
            excludeDeleted: this.excludeDeleted
        };
        if (this.amount) data.amount = this.amount;
        if (this.endDate) data.endDate = moment(endDate).format('YYYY-MM-DD');
        if (this.startDate) data.startDate = moment(this.startDate).format('YYYY-MM-DD');
        return data;
    }
    public checkPaymentForAdd(payment: Payment) {
        let createdAt = new Date(payment.createdAt).getTime();
        let companyFilter = ((this.companyId) ? payment.clientCompanyId == this.companyId : true);
        let invoiceFilter = ((this.invoiceNumber) ? payment.invoiceNumbers.includes(this.invoiceNumber) : true);
        let statusFilter = ((this.status) ? this.status == 'REFUND' && payment.paymentStatus || this.status == 'PAID' && !payment.paymentStatus : true);
        let dateFilter = ((this.startDate) ? createdAt <= this.endDate && createdAt >= this.startDate : true);
        return companyFilter && invoiceFilter && statusFilter && dateFilter;
    }
}