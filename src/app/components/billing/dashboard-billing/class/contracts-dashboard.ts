export class ContractsDashboard {
    CURRENT: number = 0;
    TERMINATED: number = 0;
    EXPIRED: number = 0;
    PENDING: number = 0;
    constructor(data = null) {
        if (data) {
            this.CURRENT = (data.CURRENT) ? data.CURRENT : 0;
            this.TERMINATED = (data.TERMINATED) ? data.TERMINATED : 0;
            this.EXPIRED = (data.EXPIRED) ? data.EXPIRED : 0;
            this.PENDING = (data.PENDING) ? data.PENDING : 0;
        }
    }
    public getTotal() {
        return this.CURRENT + this.TERMINATED + this.EXPIRED + this.PENDING;
    }
}