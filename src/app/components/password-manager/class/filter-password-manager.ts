import { Company } from "src/app/interfaces/company/company";
import { FilterListTop } from "src/class/list/filter-list-top";
import { TitleListType } from "../../tickets/tickets/tickets-header/class/title-list-type";
import { PasswordDeviceUser } from "./password-device-user";
import { PasswordRecord } from "./password-record";
import { PasswordRecordCategories } from "./password-record-categories";

export class FilterPasswordManager {
    filterTop: Array<FilterListTop> = [new FilterListTop('COMPANY_NAME', 'ASC'),
    new FilterListTop('CATEGORY', ''),
    new FilterListTop('DESCRIPTION', ''),
    new FilterListTop('USERNAME', '')];
    search: string;
    selectedCompany: Company;
    selectedDate: TitleListType;
    selectedUserOrDevice: PasswordDeviceUser;
    selectedCategory: PasswordRecordCategories;
    preloaderDevices: boolean = false;
    page: number = 0;
    limit: number = 30;
    constructor() {

    }
    public setPreloaderDevices(data) {
        this.preloaderDevices = data;
    }
    public getPreloaderDevices() {
        return this.preloaderDevices;
    }
    public getDataForRequest() {
        let sortOrder = this.filterTop.find(item => item.filter != '');
        let data: any = {
            size: this.limit,
            page: this.page,
            sortOrder: `${sortOrder.field}_${sortOrder.filter}`
        };
        if (this.selectedCategory) data.categoryId = this.selectedCategory.id;
        if (this.selectedCompany) data.companyId = this.selectedCompany.id;
        if (this.search) data.description = this.search;
        if (this.selectedUserOrDevice && this.selectedUserOrDevice.type == "USER") data.linkedUserId = this.selectedUserOrDevice.id;
        if (this.selectedUserOrDevice && this.selectedUserOrDevice.type == "DEVICE") data.gadgetId = this.selectedUserOrDevice.id;
        if (this.selectedDate) data.expireDateLeft = this.selectedDate.type;
        return data
    }
    public setSearch(data) {
        this.search = data;
    }
    public setDeviceUser(data) {
        this.selectedUserOrDevice = data;
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
        this.page = 0;
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
                    if (this.selectedDate.type === "5" && day > 5) return false;
                    if (this.selectedDate.type === "15" && day > 15) return false;
                    if (this.selectedDate.type === "30" && day > 30) return false;
                } else {
                    return false;
                }
            }
            if (this.selectedUserOrDevice) {
                let find = false;
                item.links.forEach(link => {
                    if (link.userId && link.userId == this.selectedUserOrDevice.id) find = true;
                    if (link.deviceId && link.deviceId == this.selectedUserOrDevice.id) find = true;
                });
                if (!find) return false;
            }
            if (this.selectedCategory && item.template.name !== this.selectedCategory.name) return false;
            if (this.search) {
                let find = false;
                item.links.forEach(link => {
                    if (link.userId && link.userName && link.userName.toLocaleLowerCase().includes(this.search.toLocaleLowerCase())) find = true;
                    if (link.deviceId && link.deviceLabel.toLocaleLowerCase().includes(this.search.toLocaleLowerCase())) find = true;
                });
                if (!(item.description ? item.description.toLocaleLowerCase() : "").includes(this.search.toLocaleLowerCase()) && !find) return false;
            }
            return true;
        })
        return list;
    }
    public clearFilter() {
        this.filterTop.forEach(item => item.filter = '');
    }
    public setSort(field) {
        this.filterTop.forEach(item => {
            if (item.field == field) {
                if (item.filter === '' || item.filter === 'DESC') {
                    item.filter = 'ASC';
                } else {
                    item.filter = 'DESC';
                }
            } else {
                item.filter = '';
            }
        })
    }
}