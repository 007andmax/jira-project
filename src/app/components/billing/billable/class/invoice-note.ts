export class InvoiceNote {
    id: string;
    content: string;
    title: string;
    constructor(data = null) {
        if (data) {
            this.id = data.id;
            this.content = data.content;
            this.title = (data.title) ? data.title : "";
        }
    }
    public getDataForAdd() {
        return {
            content: this.content,
            title: this.title
        }
    }
}