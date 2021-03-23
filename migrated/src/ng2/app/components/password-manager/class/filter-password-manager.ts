import { CategoryProduct } from "src/ng2/app/interfaces/product/category-product";
import { Company } from "src/ng2/app/interfaces/quote/company";
import { FilterListTop } from "src/ng2/class/list/filter-list-top";
import { TitleListType } from "../../tickets/tickets/tickets-header/class/title-list-type";
import { PasswordRecord } from "./password-record";

export class FilterPasswordManager {
    filterTop: Array<FilterListTop> = [new FilterListTop('company', 'ASC'),
    new FilterListTop('account_type', ''),
    new FilterListTop('description', ''),
    new FilterListTop('user_password', '')];


    selectedCompany: Company;
    selectedDate: TitleListType;
    selectedUserOrDevice: any;
    selectedCategory: any;
    constructor() {

    }
    public setDate(data) {
        this.selectedDate = data;
    }
    public setCategory(data) {
        this.selectedCategory = data;
    }
    public setCompany(data) {
        this.selectedCompany = data;
    }

    public setFilter(data) {
        this.selectedCompany = data.selectedCompany;
        this.selectedDate = data.selectedDate;
        this.selectedUserOrDevice = data.selectedUserOrDevice;
        this.selectedCategory = data.selectedCategory;
    }
    public getFilterList(reqList: Array<PasswordRecord>) {

        let list = reqList.filter((item) => {

            if (this.selectedCompany && item.companyId !== this.selectedCompany.id) return false;
            if (this.selectedDate) {
                if (!item.expiredDate) return false;
                let current = new Date().getTime();
                let expired = new Date(item.expiredDate).getTime();
                if (expired > current) {
                    let day = (expired - current) / 86400000;
                    if (this.selectedDate.type === "5_DAYS" && day > 5) return false;
                    if (this.selectedDate.type === "15_DAYS" && day > 15) return false;
                    if (this.selectedDate.type === "30_DAYS" && day > 30) return false;
                } else {
                    return false;
                }
            }
            if (this.selectedUserOrDevice && this.selectedUserOrDevice.id) {
                let find = false;
                item.links.forEach(link => {
                    if (link.userId && link.userId == this.selectedUserOrDevice.id) find = true;
                    if (link.deviceId && link.deviceId == this.selectedUserOrDevice.id) find = true;
                });
                if (!find) return false;
            }
            if (this.selectedCategory && item.template !== this.selectedCategory.UPPERCASE) return false;
            return true;
        })
        return list;

    }
    public clearFilter() {
        this.filterTop.forEach(item => item.filter = '');
    }
    public onFilter(field, reqList) {

        let index = this.filterTop.findIndex(item => item.field === field);
        if (index > -1) {
            let sort = this.filterTop[index].filter;
            if (field === 'account_type') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onAccountType(reqList);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    reqList.reverse();
                }

            }
            if (field === 'company') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterCompany(reqList);

                } else {

                    this.filterTop[index].filter = 'DESC';
                    reqList.reverse();
                }


            }
            if (field === 'description') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterDescription(reqList);

                } else {

                    this.filterTop[index].filter = 'DESC';
                    reqList.reverse();
                }


            }
            if (field === 'user_password') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterUserName(reqList);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    reqList.reverse();
                }


            }




        }
    }
    private onFilterUserName(reqList) {
        reqList.sort((a, b) => (a.companyName.toLowerCase() > b.companyName.toLowerCase()) ?
            1 : (b.companyName.toLowerCase() > a.companyName.toLowerCase() ? -1 : 0));
    }
    private onFilterCompany(reqList) {
        reqList.sort((a, b) => (a.companyName.toLowerCase() > b.companyName.toLowerCase()) ?
            1 : (b.companyName.toLowerCase() > a.companyName.toLowerCase() ? -1 : 0));
    }
    private onFilterDescription(reqList) {
        reqList.sort((a, b) => ((a.description ? a.description : '').toLowerCase() > (b.description ? b.description : '').toLowerCase()) ?
            1 : ((b.description ? b.description : '').toLowerCase() > (a.description ? a.description : '').toLowerCase() ? -1 : 0));
    }
    private onAccountType(reqList) {
        reqList.sort((a, b) => (a.template > b.template) ?
            1 : ((b.template > a.template) ? -1 : 0));
    }
}