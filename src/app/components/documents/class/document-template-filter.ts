export class DocumentTemplateFilter {
    categoryId: string;
    searchText: string = "";
    documentType: string = "TEMPLATE";
    isDefaultTemplate: boolean = true;
    constructor() {

    }
    public getDataForFilter() {
        return {
            categoryId: this.categoryId,
            documentType: this.documentType,
            isDefaultTemplate: this.isDefaultTemplate
        }
    }
    public setFilters(data) {
        this.categoryId = data.categoryId;

    }
    public setIsDefaultTemplate(data) {
        this.isDefaultTemplate = data;
    }
    public setDocumentType(data) {
        this.setDocumentType = data;
    }
    public setCategoryId(data) {
        this.categoryId = data;
    }
    public setSearch(data) {
        this.searchText = data;
    }
    public getFilterList(reqList) {
        return reqList.filter(item => {
            let title = item.title ? item.title.toLowerCase() : "";
            let description = item.description ? item.description.toLowerCase() : "";
            return (this.searchText.length === 0) ? true : title.includes(this.searchText) || description.includes(this.searchText);
        });
    }
    public isMatchIheFilter(item) {
        let title = item.title ? item.title.toLowerCase() : "";
        let description = item.description ? item.description.toLowerCase() : "";
        return (this.searchText.length === 0) ? true : title.includes(this.searchText) || description.includes(this.searchText) || item.categoryId === this.categoryId;
    }

}