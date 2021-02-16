import { GlobalSearchResultItem } from "./global-search-result-item";

export class GlobalSearchResult {
    list: Array<GlobalSearchResultItem> = [];
    type: string;
    constructor(data) {
        this.list = data.list.map(item => new GlobalSearchResultItem(item));
        this.type = data.type;
    }
}