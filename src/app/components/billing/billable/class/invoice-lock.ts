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
    public getDatForCreate(sendNotification) {
        return {
            lockId: this.lockId,
            billTo: this.invoiceDataDto.billTo[0].id,
            shipTo: this.invoiceDataDto.shipTo[0].id,
            sendNotification: sendNotification,
            includeAccountReceivableReportAsAttachmentSetting: this.includeAccountReceivableReportAsAttachmentSetting,
            includeInvoiceAsAttachment: this.includeInvoiceAsAttachmentSetting
        }
    }
}