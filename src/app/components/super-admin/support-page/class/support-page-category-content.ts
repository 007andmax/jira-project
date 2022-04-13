export class SupportPageCategoryContent {
    type: string;
    document: {
        id: string;
        content: string;
    };
    createdAt: string = "";
    createdBy: string = "";
    tagIds: Array<string> = [];
    newContent: string;
    isEditMode: boolean = false;
    tags: Array<any> = [];
    constructor() {

    }
    public setIdDocument(data) {
        this.document.id = data;
    }
    public parseContent(domain) {
        var urlRegex = /(((https?:\/\/)|(http?:\/\/)|(www\.))[^\s]+)/g;
        let links = [];
        console.log("content", this.newContent);
        let newContent = this.newContent.replace(urlRegex, function (url) {
            console.log("url", url);
            var link = url.replace('\"', '').replace('/attachment', '').replace('\"', '');
            var index = link.lastIndexOf("/");
            var id = link.substring(index + 1, link.length);
            console.log("id", id);
            links.push(url.replace('\"', '').replace('/attachment', ''));
            return link.includes("support-page") && id.length > 10 ? `${domain}/${id}"` : url;
        });
        console.log("newContent", newContent);
        console.log("links", links);
        return newContent;
    }
    public setContent(data) {
        if (data && data.document) {
            this.document = {
                id: data.document.id,
                content: data.document.content
            }
            this.createdAt = data.document.createdAt;
            this.createdBy = data.document.createdBy;
            this.newContent = JSON.parse(JSON.stringify(data.document.content));
        } else {
            this.document = {
                id: "",
                content: "",
            }
            this.newContent = "";
            this.tagIds = [];
            this.tags = [];
        }
    }
    public setType(data) {
        this.type = data;
    }
    private getChangedContent(content) {
        var urlRegex = /(((https?:\/\/)|(http?:\/\/)|(www\.))[^\s]+)/g;
        let links = [];
        console.log("content", content);
        let newContent = content.replace(urlRegex, function (url) {
            console.log("url", url);
            var link = url.replace('\"', '').replace('/attachment', '').replace('\"', '');
            var index = link.lastIndexOf("/");
            var id = link.substring(index + 1, link.length);
            console.log("id", id);
            console.log("id", id.match("^(?!\\d+$)\\w{8,20}$"))
            console.log("id", id.match(/^(?=.*[a-z])[a-z0-9]{8,20}$/i))
            links.push(url.replace('\"', '').replace('/attachment', ''));
            return (link.includes("support-page") && id.length > 10 ? `http://support-page.com/${id}"` : url);
        });
        console.log("newContent", newContent);
        console.log("links", links);
        return newContent;

    }
    public getData() {
        if (this.isEditMode) {
            let document = null;
            if (this.newContent != this.document.content) document = {
                id: this.document.id,
                content: this.newContent,
            }
            if (this.type === "PUBLISHED") document = {
                id: this.document.id,
                content: this.getChangedContent(this.newContent),
            }
            return {
                type: this.type,
                document: document,
                tagIds: this.tagIds
            }
        }
        return {
            type: this.type,
            document: {
                content
                    : this.newContent
            },
            tagIds: this.tagIds
        }
    }
    public setEditMode(data) {
        this.isEditMode = data;
    }
    public setIdTags(data) {
        this.tagIds = data;
    }
    public setTags(data) {
        this.tags = data;
    }
    public setNewContent(data) {
        this.newContent = data;
    }

}