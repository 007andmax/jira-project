import { FilterListTop } from 'src/ng2/class/list/filter-list-top';
import { InventoryItem } from './inventory-item';
import { Company } from 'src/ng2/app/interfaces/company/company';
import { CategoryProductitem } from 'src/ng2/class/category-product-item';

export class InventoryFilter {
    filterTop: Array<FilterListTop> = [new FilterListTop('description', 'ASC'),
    new FilterListTop('category', ''),
    new FilterListTop('cost', ''),
    new FilterListTop('sale', ''),
    new FilterListTop('manufacture', ''),
    new FilterListTop('ilc', ''),
    new FilterListTop('glNumber', '')];

    sortCategoty: CategoryProductitem = null;
    active: boolean = true;
    productSearchName: string = "";
    constructor() { }


    public setSortCategoty(data) {
        this.sortCategoty = data;
    }
    public setActive(data) {
        this.active = data;
    }
    public setProductSearchName(data) {
        this.productSearchName = data;
    }
    public getActive() {
        return this.active;
    }
    public getFilterList(reqInventoryList: Array<InventoryItem>) {
        let list = reqInventoryList.filter((item: InventoryItem) => {
            if (this.sortCategoty && item.category.id !== this.sortCategoty.id) return false;
            if (item.active != this.active) return false;
            if (this.productSearchName.length > 0 && (!item.description.toLowerCase().includes(this.productSearchName.toLowerCase()) && !(item.ilc && item.ilc.toLowerCase().includes(this.productSearchName.toLowerCase())) && !item.isFindGlNumber(this.productSearchName) && !(item.manufacture && item.manufacture.toLowerCase().includes(this.productSearchName.toLowerCase())))) return false;
            return true;
        })
        return list;
    }
    public clearFilter() {
        this.filterTop.forEach(item => item.filter = '');
    }
    public onSetFilter(field) {
        let index = this.filterTop.findIndex(item => item.field === field);
        if (index > -1) {
            let sort = this.filterTop[index].filter;
            this.clearFilter();
            if (field === 'description') {
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                } else {
                    this.filterTop[index].filter = 'DESC';
                }
            }
            if (field === 'category') {
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                } else {
                    this.filterTop[index].filter = 'DESC';
                }
            }
            if (field === 'cost') {
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                } else {
                    this.filterTop[index].filter = 'DESC';
                }
            }
            if (field === 'sale') {
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                } else {
                    this.filterTop[index].filter = 'DESC';
                }
            }
            if (field === 'manufacture') {
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                } else {
                    this.filterTop[index].filter = 'DESC';
                }
            }
            if (field === 'ilc') {
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                } else {
                    this.filterTop[index].filter = 'DESC';
                }
            }
            if (field === 'glNumber') {
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                } else {
                    this.filterTop[index].filter = 'DESC';
                }
            }
        }
    }
    public onFilter(reqInventory, companies, glNumbers) {
        let index = this.filterTop.findIndex(item => item.filter !== '');
        if (index > -1) {
            let sort = this.filterTop[index].filter;
            let field = this.filterTop[index].field;
            if (field === 'description') {
                this.onFilterDescription(reqInventory);
                if (sort !== 'ASC') reqInventory.reverse();
            }
            if (field === 'category') {
                this.onFilterCategory(reqInventory);
                if (sort !== 'ASC') reqInventory.reverse();
            }
            if (field === 'cost') {
                this.onFilterCost(reqInventory);
                if (sort !== 'ASC') reqInventory.reverse();
            }
            if (field === 'sale') {
                this.onFilterSale(reqInventory);
                if (sort !== 'ASC') reqInventory.reverse();
            }
            if (field === 'manufacture') {
                this.onFilterManufacture(reqInventory);
                if (sort !== 'ASC') reqInventory.reverse();
            }
            if (field === 'ilc') {
                this.onFilterIlc(reqInventory);
                if (sort !== 'ASC') reqInventory.reverse();
            }
            if (field === 'glNumber') {
                this.onFilterGlNumber(reqInventory, glNumbers);
                if (sort !== 'ASC') reqInventory.reverse();
            }
        }
    }
    private getCompanyName(inventory, companies) {
        let index = companies.findIndex(item => item.id === inventory.companyId);
        return (index > -1) ? companies[index].name : '';
    }
    private onFilterCost(reqInventory) {
        reqInventory.sort((a, b) => {
            return (a.cost > b.cost) ?
                1 : ((b.cost > a.cost) ? -1 : 0)
        });
    }

    private onFilterSale(reqInventory) {
        reqInventory.sort((a, b) => {
            return (a.sale > b.sale) ?
                1 : ((b.sale > a.sale) ? -1 : 0)
        });
    }
    private onFilterCompany(reqInventory, companies) {
        reqInventory.sort((a, b) => {
            let first = this.getCompanyName(a, companies);
            let next = this.getCompanyName(b, companies);
            return (first.toLowerCase() > next.toLowerCase()) ?
                1 : ((next.toLowerCase() > first.toLowerCase()) ? -1 : 0)
        });
    }
    private onFilterGlNumber(reqInventory, glNumbers) {
        reqInventory.sort((a, b) => {
            let first = (a.glNumber && a.glNumber.glNumber) ? a.glNumber.glNumber : '';
            let next = (b.glNumber && b.glNumber.glNumber) ? b.glNumber.glNumber : '';
            return (first.toLowerCase() > next.toLowerCase()) ?
                1 : ((next.toLowerCase() > first.toLowerCase()) ? -1 : 0)
        });
    }
    private onFilterCategory(reqInventory) {
        reqInventory.sort((a, b) => (a.category.name.toLowerCase() > b.category.name.toLowerCase()) ?
            1 : ((b.category.name.toLowerCase() > a.category.name.toLowerCase()) ? -1 : 0));
    }
    private onFilterIlc(reqInventory) {
        reqInventory.sort((a, b) => (((a.ilc) ? a.ilc : '').toLowerCase() > ((b.ilc) ? b.ilc : '').toLowerCase()) ?
            1 : ((((b.ilc) ? b.ilc : '').toLowerCase() > ((a.ilc) ? a.ilc : '').toLowerCase()) ? -1 : 0));
    }
    private onFilterManufacture(reqInventory) {
        reqInventory.sort((a, b) => (((a.manufacture) ? a.manufacture : '').toLowerCase() > ((b.manufacture) ? b.manufacture : '').toLowerCase()) ?
            1 : ((((b.manufacture) ? b.manufacture : '').toLowerCase() > ((a.manufacture) ? a.manufacture : '').toLowerCase()) ? -1 : 0));
    }
    private onFilterDescription(reqInventory) {
        reqInventory.sort((a, b) => (((a.description) ? a.description : '').toLowerCase() > ((b.description) ? b.description : '').toLowerCase()) ?
            1 : ((((b.description) ? b.description : '').toLowerCase() > ((a.description) ? a.description : '').toLowerCase()) ? -1 : 0));
    }
}