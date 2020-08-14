import { InvoicesFilter } from '../../invoices/class/invoices-filter';
import { Payment } from './payment';

export class PaymentsFilter extends InvoicesFilter {



    public checkPaymentForAdd(payment:Payment) {
        let createdAt = new Date(payment.createdAt).getTime();
        let companyFilter = ((this.companyName) ? payment.clientCompanyName == this.companyName : true);
        let invoiceFilter = ((this.invoiceNumber) ? payment.invoiceNumbers.includes(this.invoiceNumber) : true);
        let statusFilter = ((this.status) ? this.status == 'REFUND' && payment.refundMethod ||  this.status == 'PAID' && !payment.refundMethod : true);
        let dateFilter = ((this.startDate) ? createdAt <= this.endDate && createdAt>= this.startDate : true);
        return companyFilter && invoiceFilter && statusFilter && dateFilter;
    }
}