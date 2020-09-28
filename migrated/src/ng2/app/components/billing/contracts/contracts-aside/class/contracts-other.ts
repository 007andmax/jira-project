import { ContractsUserDevice } from './contracts-user-device';

export class ContractsOther extends ContractsUserDevice {
    billType: "OTHER";


    public getTotalAmountOther() {
        let totalAmount = 0;
        if (this.productExpenses.length > 0) {
            for (var i = 0; i < this.productExpenses.length; i++) {
                var productCost = this.productExpenses[i].quantity * this.productExpenses[i].salePrice;
                totalAmount = totalAmount + productCost;
            }
        }
        return totalAmount;
    }
}