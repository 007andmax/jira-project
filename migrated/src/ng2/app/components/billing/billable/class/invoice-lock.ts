import { InvoiceDto } from './invoice-dto';

export class InvoiceLock {
    alreadyLockedTickets: Array<any> = [];
    invoiceDataDto: InvoiceDto;
    lockId: string;
    lockedTickets: Array<string> = [];
    constructor(data) {
        this.alreadyLockedTickets =  data.alreadyLockedTickets;
        this.invoiceDataDto =  data.invoiceDataDto;
        this.lockId =  data.lockId;
        this.lockedTickets =  data.lockedTickets;
    }
}