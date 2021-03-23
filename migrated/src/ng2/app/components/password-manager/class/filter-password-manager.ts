import { CategoryProduct } from "src/ng2/app/interfaces/product/category-product";
import { Company } from "src/ng2/app/interfaces/quote/company";
import { PasswordRecord } from "./password-record";

export class FilterPasswordManager {
    sort: string = 'companyName';
    direction: string = 'ASC';
    company: any;
    user: any;
    dateFormat: any;
    passwordCategory: any;

    selectedCompany: Company;
    selectedDate: string;
    selectedUserOrDevice: any;
    selectedCategory: CategoryProduct;
    constructor() {

    }
    public resetDirection() {
        this.direction = null;
    }
    public getFilterList(reqList: Array<PasswordRecord>) {

        let list = reqList.filter((item) => {

            if (this.selectedCompany && item.companyId !== this.selectedCompany.id) return false;
            if (this.selectedDate && item.expiredDate !== this.selectedDate) return false;
            if (this.selectedUserOrDevice && this.selectedUserOrDevice.id) {
                let find = false;
                item.links.forEach(link => {
                    if (link.userId && link.userId == this.selectedUserOrDevice.id) find = true;
                    if (link.deviceId && link.deviceId == this.selectedUserOrDevice.id) find = true;
                });
                if (!find) return false;
            }

            return true;
        }).sort((a, b) => (a.companyName.toLowerCase() > b.companyName.toLowerCase()) ?
            1 : ((b.companyName.toLowerCase() > a.companyName.toLowerCase()) ? -1 : 0));
        return list;

    }
}