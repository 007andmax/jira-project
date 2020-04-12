import { Ticket } from "../../quote/ticket";
import { Company } from "../../quote/company";

export interface reqCreateQuote {
    id: string;
    requestPayment: boolean;
    number: string;
    purchaseOrder: string;
    partialDeposit: string;
    status: string;
    message: string;
    recipients: string;
    ticket: Ticket;
    company: Company;
    validUntil: number;
    createdAt: number;
    readAt: any;
    deletedAt: any;
}