export class CompanyAssigned {
    id: string;
    name: string;
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
    }
}