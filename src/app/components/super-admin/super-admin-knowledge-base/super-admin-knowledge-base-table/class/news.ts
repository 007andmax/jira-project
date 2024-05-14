export class News {
    "id": string;
    "title": string;
    "content": string = "";
    "status": string = "DRAFT";
    "createdAt": number;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }
    }
    public getDataForCreate() {
        return {
            "title": this.title,
            "content": this.content,
            "status": this.status
        }
    }
}