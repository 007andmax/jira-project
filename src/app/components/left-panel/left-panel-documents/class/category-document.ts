export class CategoryDocument {
    name: string;
    id: string;
    count: number;
    assignedToCompany: boolean;
    constructor(data) {
        this.name = data.name;
        this.id = data.id;
        this.count = data.count;
        this.assignedToCompany = data.assignedToCompany;
    }
}