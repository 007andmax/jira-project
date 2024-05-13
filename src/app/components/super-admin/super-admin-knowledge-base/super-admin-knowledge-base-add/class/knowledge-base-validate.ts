import { News } from "../../super-admin-knowledge-base-table/class/news";

export class KnowledgeBaseValidate {
    title: boolean = true;
    content: boolean = true;
    constructor() { }
    public getTitle() {
        return this.title;
    }
    public resetTitle() {
        this.title = true;
    }
    public resetContent() {
        this.content = true;
    }
    public getContent() {
        return this.content;
    }
    public isValidate(news: News) {
        if (!news.title || news.title.length < 1 || news.title.length > 255) this.title = false;
        if (!news.content || news.content.length < 1 || news.content.length > 10000) this.content = false;
        return this.title && this.content;

    }
}