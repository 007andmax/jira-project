export class BillableProfileTicket {
    closedAt: number;
    companyId: string;
    discountSum: number;
    id: string;
    isOrder: boolean;
    lockedBy: null
    productExpense: null
    productSum: number;
  //  serviceExpense: [{…}]
    serviceSum: number;
    subject: string;
    sum: number;
    taxSum: number;
    ticketNumber: string;
}