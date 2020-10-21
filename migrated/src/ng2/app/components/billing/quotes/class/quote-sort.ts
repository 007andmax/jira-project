export class QuoteSort {
      quoteNumber = 'QUOTE_NUMBER_DESC';
      customerName = 'CUSTOMER_NAME_DESC';
      date = 'DATE_DESC';
      validUntil = 'VALID_UNTIL_DESC';
      amount = 'AMOUNT_DESC';
      deposit = 'DEPOSIT_DESC';
      sortType = null;
      constructor() {

      }
      public getSortType(type) {
        switch (type) {
          case 'number':
            this.sortType = this.quoteNumber === 'QUOTE_NUMBER_ASC' ? 'QUOTE_NUMBER_DESC' : 'QUOTE_NUMBER_ASC';
            this.quoteNumber = this.sortType;
            console.log("this.sortType",this.sortType);
            break;
          case 'customerName':
            this.sortType = this.customerName === 'CUSTOMER_NAME_DESC' ? 'CUSTOMER_NAME_ASC' : 'CUSTOMER_NAME_DESC';
            this.customerName = this.sortType;
            break;
          case 'date':
            this.sortType = this.date === 'DATE_DESC' ? 'DATE_ASC' : 'DATE_DESC';
            this.date = this.sortType;
            break;
          case 'validUntil':
            this.sortType = this.validUntil === 'VALID_UNTIL_DESC' ? 'VALID_UNTIL_ASC' : 'VALID_UNTIL_DESC';
            this.validUntil = this.sortType;
            break;
          case 'amount':
            this.sortType = this.amount === 'AMOUNT_DESC' ? 'AMOUNT_ASC' : 'AMOUNT_DESC';
            this.amount = this.sortType;
            break;
          case 'deposit':
            this.sortType = this.deposit === 'DEPOSIT_DESC' ? 'DEPOSIT_ASC' : 'DEPOSIT_DESC';
            this.deposit = this.sortType;
            break;
        }
        return this.sortType;
      }
}