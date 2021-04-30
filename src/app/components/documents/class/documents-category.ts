import { Document } from "./document";

export class DocumentsCategory {
    name: string;
    list: Array<Document> = [];
    constructor(name, list) {
        this.name = name;
        this.list = list.map(item => new Document(item));
    }
}