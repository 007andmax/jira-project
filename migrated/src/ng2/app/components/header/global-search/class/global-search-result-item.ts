export class GlobalSearchResultItem {
    extraInfo: string;
    id: string;
    info: string;
    name: string;
    type: string;
    constructor(data) {
        this.extraInfo = data.extraInfo;
        this.id = data.id;
        this.info = data.info;
        this.name = data.name;
        this.type = data.type;
    }
}