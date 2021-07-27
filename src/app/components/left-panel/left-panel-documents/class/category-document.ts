export class CategoryDocument {
    name: string;
    id: string;
    count: number;
    constructor(data) {
        this.name = data.name;
        this.id = data.id;
        this.count = data.count;
    }
}