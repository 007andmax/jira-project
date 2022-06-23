import { InvoiceDto } from './invoice-dto';

export class InvoiceLock {
    alreadyLockedTickets: Array<any> = [];
    invoiceDataDto: InvoiceDto;
    lockId: string;
    lockedTickets: Array<string> = [];
    includeAccountReceivableReportAsAttachment: boolean = false;
    enableAccountReceivableReportAsAttachment: boolean;
    includeInvoiceAsAttachmentSetting: boolean;
    constructor(data) {
        this.alreadyLockedTickets = data.alreadyLockedTickets;
        this.invoiceDataDto = data.invoiceDataDto;
        this.lockId = data.lockId;
        this.lockedTickets = data.lockedTickets;
        this.enableAccountReceivableReportAsAttachment = data.includeAccountReceivableReportAsAttachment;
        this.includeInvoiceAsAttachmentSetting = data.includeInvoiceAsAttachmentSetting;
        this.includeAccountReceivableReportAsAttachment = JSON.parse(JSON.stringify(data.includeAccountReceivableReportAsAttachment));
    }
    public setInvoiceDataDto(data) {
        this.invoiceDataDto = data;
    }
    public getDatForCreate(sendNotification) {
        return {
            lockId: this.lockId,
            billTo: this.invoiceDataDto.billTo[0].id,
            shipTo: this.invoiceDataDto.shipTo[0].id,
            sendNotification: sendNotification,
            includeAccountReceivableReportAsAttachment: this.includeAccountReceivableReportAsAttachment,
            includeInvoiceAsAttachment: this.includeInvoiceAsAttachmentSetting
        }
    }
}