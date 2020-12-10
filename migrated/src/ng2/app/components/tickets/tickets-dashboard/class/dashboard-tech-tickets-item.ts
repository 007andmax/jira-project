import { DashboardTechTicketsItemValue } from './dashboard-tech-tickets-item-value';

export class DashboardTechTicketsItem {
    userId: string;
    values: Array<DashboardTechTicketsItemValue> = [];
    constructor(userId) {
        this.userId = userId;
    }
    public addValue(type, value) {
        this.values.push(new DashboardTechTicketsItemValue(type, value));
    }
    getValue(type) {
        let find = this.values.find(item => item.type === type);
        return (find) ? find.value : 0;
    }
}