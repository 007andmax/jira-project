import { InvoiceDto } from '../../billable/class/invoice-dto';
import { Invoice } from './invoice';

export class InvoiceProfile extends InvoiceDto {
    id: string;
    isOverDue: boolean = false;
    paidOn: any;
    readedAt: number;
    public onCheckIsOverDue() {
        var today = Date.now();
        var dueDate = new Date(this.dueDate).getTime();
        let overDue = (dueDate - today) / 86400000;
        this.isOverDue = (overDue < 0);

    }
    public getDataForRecordPayment() {
        return {
            id: this.id,
            companyId: this.company.id
        }
    }

    public setId(data) {
        this.id = data;
    }
}