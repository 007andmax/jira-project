import { FilterListTop } from "src/class/list/filter-list-top";

export class DocumentFilter {
    filterTop: Array<FilterListTop> = [new FilterListTop('title', 'ASC'),
    new FilterListTop('createBy', ''),
    new FilterListTop('createdDate', ''),
    new FilterListTop('reviewDate', '')];
    categoryId: string;
    tags: Array<string> = [];
    userId: string;
    reviewDateStart: string;
    reviewDateEnd: string;
    companyId: string;
    isCompanyScope: boolean;
    constructor() {

    }
    public onFilter(field, reqList, userList) {
        let index = this.filterTop.findIndex(item => item.field === field);
        if (index > -1) {
            let sort = this.filterTop[index].filter;
            if (field === 'title') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterTitle(reqList);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    reqList.reverse();
                }
            }
            if (field === 'createBy') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterCreateBy(reqList, userList);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    reqList.reverse();
                }
            }
            if (field === 'createdDate') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterCreatedDate(reqList);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    reqList.reverse();
                }
            }
            if (field === 'reviewDate') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterReviewDate(reqList);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    reqList.reverse();
                }
            }
        }
    }
    public clearFilter() {
        this.filterTop.forEach(item => item.filter = '');
    }
    private onFilterReviewDate(reqList) {
        reqList.sort((a, b) => (this.getReviewDate(a) > this.getReviewDate(b)) ?
            1 : (this.getReviewDate(b) > this.getReviewDate(a) ? -1 : 0));
    }
    private onFilterCreatedDate(reqList) {
        reqList.sort((a, b) => (this.getCreatedAt(a) > this.getCreatedAt(b)) ?
            1 : (this.getCreatedAt(b) > this.getCreatedAt(a) ? -1 : 0));
    }
    public getCreatedAt(item) {
        return item.isCategory ? '' : item.createdAt
    }
    public getReviewDate(item) {
        return item.isCategory ? '' : item.reviewDate
    }
    private onFilterTitle(reqList) {
        reqList.sort((a, b) => (this.getTtitle(a).toLowerCase() > this.getTtitle(b).toLowerCase()) ?
            1 : (this.getTtitle(b).toLowerCase() > this.getTtitle(a).toLowerCase() ? -1 : 0));
    }
    private onFilterCreateBy(reqList, userList) {
        reqList.sort((a, b) => (this.getCreateBy(userList, a).toLowerCase() > this.getCreateBy(userList, b).toLowerCase()) ?
            1 : (this.getCreateBy(userList, b).toLowerCase() > this.getCreateBy(userList, a).toLowerCase() ? -1 : 0));
    }
    getCreateBy(userList, document) {
        let user = userList.find(item => item.id === document.createdBy)
        return (user) ? `${user.firstName} ${user.lastName}` : '';
    }
    private getTtitle(item) {
        return item.isCategory ? item.categoryName : item.title
    }
    public setCompanyScope(data) {
        this.isCompanyScope = data;
    }
    public getDataForFilter() {
        return {
            linkedCompanyId: (this.categoryId) ? this.categoryId : undefined,
            tags: (this.tags.length > 0) ? this.tags : undefined,
            userId: (this.userId) ? this.userId : undefined,
            reviewDateStart: (this.reviewDateStart) ? this.reviewDateStart : undefined,
            reviewDateEnd: (this.reviewDateEnd) ? this.reviewDateEnd : undefined,
            companyId: (this.companyId) ? this.companyId : undefined,
            isCompanyScope: (this.isCompanyScope) ? this.isCompanyScope : undefined
        }
    }
    public isExistFilters() {
        return this.categoryId || this.tags.length > 0 || this.userId || this.reviewDateStart && this.reviewDateEnd || this.companyId;
    }
    public setFilters(data) {
        this.tags = data.tags;
        this.userId = data.userId;
        this.reviewDateStart = data.reviewDateStart;
        this.reviewDateEnd = data.reviewDateEnd;
        this.companyId = data.companyId;
    }
    public setCategoryId(data) {
        this.categoryId = data;
    }
    public setCompanyId(data) {
        this.companyId = data;
    }
    public setTags(data) {
        this.tags = data;
    }
    public setUserId(data) {
        this.userId = data;
    }
    public setReviewDateStart(data) {
        this.reviewDateStart = data;
    }
    public setReviewDateEnd(data) {
        this.reviewDateEnd = data;
    }
}