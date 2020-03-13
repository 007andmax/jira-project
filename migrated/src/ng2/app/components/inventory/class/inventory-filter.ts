import { FilterListTop } from 'src/ng2/class/list/filter-list-top';
import { InventoryItem } from './inventory-item';
import { Company } from 'src/ng2/app/interfaces/company/company';

export class InventoryFilter {
    filterTop: Array<FilterListTop> = [new FilterListTop('description', 'ASC'),
    new FilterListTop('vendor', ''),
    new FilterListTop('cost', ''),
    new FilterListTop('sale', ''),
    new FilterListTop('manufacture', ''),
    new FilterListTop('ilc', ''),
    new FilterListTop('glNumber', '')];
    categoryId: string;

    constructor() { }


    public setCompanyId(data) {
        this.categoryId = data;
    }

    public getFilterList(reqInventoryList: Array<InventoryItem>, companies: Array<Company>) {

        let list = reqInventoryList.filter((item: InventoryItem) => {
            let indexCompany = companies.findIndex(company => company.id === item.companyId);
            if (indexCompany > -1) return true;
            return false;

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
            console.log("sort", sort);
            if (field === 'description') {
                this.clearFilter();

                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';

                } else {
                    this.filterTop[index].filter = 'DESC';

                }

            }
            if (field === 'vendor') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {

                    this.filterTop[index].filter = 'ASC';


                } else {

                    this.filterTop[index].filter = 'DESC';

                }


            }
            if (field === 'cost') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';

                } else {
                    this.filterTop[index].filter = 'DESC';

                }


            }

            if (field === 'sale') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';

                } else {
                    this.filterTop[index].filter = 'DESC';

                }


            }


            if (field === 'manufacture') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';

                } else {
                    this.filterTop[index].filter = 'DESC';

                }


            }

            if (field === 'ilc') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';

                } else {
                    this.filterTop[index].filter = 'DESC';

                }


            }

            if (field === 'glNumber') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';

                } else {
                    this.filterTop[index].filter = 'DESC';

                }


            }
            console.log("this.filterTop[index]", this.filterTop[index]);
        }
    }
    public onFilter(reqInventory, companies,glNumbers) {
        console.log("this.filterTop", this.filterTop);
        let index = this.filterTop.findIndex(item => item.filter !== '');
        if (index > -1) {
            let sort = this.filterTop[index].filter;
            let field = this.filterTop[index].field;
            console.log("sort", sort);
            console.log("field", field);
            if (field === 'description') {

                if (sort === 'ASC') {

                    this.onFilterDescription(reqInventory);
                } else {
                    this.onFilterDescription(reqInventory);
                    reqInventory.reverse();
                }

            }
            if (field === 'vendor') {

                if (sort === 'ASC') {


                    this.onFilterCompany(reqInventory, companies);

                } else {

                    this.onFilterCompany(reqInventory, companies);
                    reqInventory.reverse();
                }


            }
            if (field === 'cost') {

                if (sort === 'ASC') {

                    this.onFilterCost(reqInventory);
                } else {
                    this.onFilterCost(reqInventory);
                    reqInventory.reverse();
                }


            }

            if (field === 'sale') {

                if (sort === 'ASC') {

                    this.onFilterSale(reqInventory);
                } else {
                    this.onFilterSale(reqInventory);
                    reqInventory.reverse();
                }


            }


            
            if (field === 'manufacture') {

                if (sort === 'ASC') {

                    this.onFilterManufacture(reqInventory);
                } else {
                    this.onFilterManufacture(reqInventory);
                    reqInventory.reverse();
                }


            }

            if (field === 'ilc') {

                if (sort === 'ASC') {

                    this.onFilterIlc(reqInventory);
                } else {
                    this.onFilterIlc(reqInventory);
                    reqInventory.reverse();
                }


            }

            if (field === 'glNumber') {

                if (sort === 'ASC') {

                    this.onFilterGlNumber(reqInventory,glNumbers);
                } else {
                    this.onFilterGlNumber(reqInventory,glNumbers);
                    reqInventory.reverse();
                }


            }
        }
    }
    private getContact(user) {
        let str = '';
        if (user.phoneNumbers && user.phoneNumbers.length && user.phoneNumbers[0] && user.phoneNumbers[0].number) str += user.phoneNumbers[0].number;
        if (user.phoneNumbers && user.phoneNumbers.length && user.phoneNumbers[1] && user.phoneNumbers[1].number) str += user.phoneNumbers[1].number;
        return str;
    }
    private getCompanyName(inventory, companies) {
        let index = companies.findIndex(item => item.id === inventory.companyId);
        return (index > -1) ? companies[index].name : '';
    }
    private getGlNumberName(inventory, glNumbers) {
        let glNumber = inventory.glNumber;
        if (!glNumber) return '';
        let index = glNumbers.findIndex(item => item.id === glNumber.id);
        return (index > -1) ? glNumbers[index].glNumber : '';
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


    private onFilterGlNumber(reqInventory,glNumbers) {
        reqInventory.sort((a, b) => {
           // let first = this.getGlNumberName(a, glNumbers);
           // let next = this.getGlNumberName(b, glNumbers);
             let first = (a.glNumber && a.glNumber.glNumber) ? a.glNumber.glNumber : '';
            let next = (b.glNumber && b.glNumber.glNumber) ? b.glNumber.glNumber : '';
            return (first.toLowerCase() > next.toLowerCase()) ?
            1 : ((next.toLowerCase() > first.toLowerCase()) ? -1 : 0)
        });
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