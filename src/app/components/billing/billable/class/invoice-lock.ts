import { InvoiceDto } from './invoice-dto';

export class InvoiceLock {
    alreadyLockedTickets: Array<any> = [];
    invoiceDataDto: InvoiceDto;
    lockId: string;
    lockedTickets: Array<string> = [];
    includeAccountReceivableReportAsAttachmentSetting: boolean = false;
    allowToGenerateAccountReceivableReport: boolean;
    includeInvoiceAsAttachmentSetting: boolean;
    constructor(data) {
        this.alreadyLockedTickets = data.alreadyLockedTickets;
        this.invoiceDataDto = data.invoiceDataDto;
        this.lockId = data.lockId;
        this.lockedTickets = data.lockedTickets;
        this.allowToGenerateAccountReceivableReport = data.allowToGenerateAccountReceivableReport;
        this.includeInvoiceAsAttachmentSetting = data.includeInvoiceAsAttachmentSetting;
        this.includeAccountReceivableReportAsAttachmentSetting = data.includeAccountReceivableReportAsAttachmentSetting;
    }
    public setInvoiceDataDto(data) {
        this.invoiceDataDto = data;
    }
    public getDatForCreate(sendNotification, company) {
        return {
            lockId: this.lockId,
            billTo: (company.addresses.length > 0) ? company.addresses[0].id : null,
            shipTo: (company.addresses.length == 2) ? company.addresses[1].id : null,
            sendNotification: sendNotification,
            includeAccountReceivableReportAsAttachment: this.includeAccountReceivableReportAsAttachmentSetting,
            includeInvoiceAsAttachment: this.includeInvoiceAsAttachmentSetting
        }
    }
}