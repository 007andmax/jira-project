export class SubscriptionServices {
    "id": string;
    "name": string;
    "rate": number;
    "taxIds": [];
    glNumberId: string;
    updateServicePricesInContracts: boolean = false;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }
    }
    public getDataForUpdate() {
        return {
            "name": this.name,
            "rate": this.rate,
            "taxIds": this.taxIds,
            glNumberId: this.glNumberId,
            updateServicePricesInContracts: this.updateServicePricesInContracts
        }
    }
    public getDataForBillableService() {
        return {
            count: 1,
            id: this.id,
            "name": this.name,
            "rate": this.rate,
            "taxIds": this.taxIds,
            glNumberId: this.glNumberId,
            updateServicePricesInContracts: this.updateServicePricesInContracts,
            subscriptionService: { id: this.id },
            parentDefaultServiceId: this.id,
            basedOnDefault: true
        }
    }
}