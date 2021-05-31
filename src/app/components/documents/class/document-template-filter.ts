export class DocumentTemplateFilter {
    categoryId: string;
    searchText: string;
    documentType: string = "TEMPLATE";
    isDefaultTemplate: boolean = true;
    constructor() {

    }
    public getDataForFilter() {
        return {
            categoryId: this.categoryId,
            searchText: this.searchText,
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

}