export class News {
    "id": string;
    "title": string;
    "content": string = "";
    "newContent": string = "";
    "status": string = "DRAFT";
    "createdAt": number;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
            if (data.content) this.newContent = JSON.parse(JSON.stringify(data.content));
        }
    }
    public parseStatus() {
        return this.status.toLocaleLowerCase();
    }
    public update(data) {
        this.content = data.content;
        this.status = data.status;
        this.title = data.title;
    }
    public setStatus(data) {
        this.status = data;
    }
    public getDataForCreate() {
        return {
            "title": this.title,
            "content": this.content,
            "status": this.status
        }
    }
    public getDataForEdit() {
        return {
            "title": this.title,
            "content": this.newContent,
            "status": this.status
        }
    }
    public setNewContent(data) {
        this.newContent = data;
    }
}