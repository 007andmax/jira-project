import { FilterListTop } from "src/class/list/filter-list-top";
import { ContractStatisticsItem } from "./contracts-statistics-item";

export class ContractStatisticsFilter {
    filterTop: Array<FilterListTop> = [new FilterListTop('company-name', ''),
    new FilterListTop('type', ''),
    new FilterListTop('description', ''),
    new FilterListTop('purchased', ''),
    new FilterListTop('used-hours', ''),
    new FilterListTop('left-hours', ''),
    new FilterListTop('exceeding-hours', ''),
    new FilterListTop('billable-hours', '')];
    direction: string;
    /**
     * @description Sort contracts list by field
     * @param  {string} field  - field for sort
     * @param  {Array<ContractStatisticsItem>} reqContracts  - contracts list for sort
     */
    public onFilter(field, reqContracts) {

        let index = this.filterTop.findIndex(item => item.field === field);
        if (index > -1) {
            let sort = this.filterTop[index].filter;
            if (field === 'company-name') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterCompanyName(reqContracts);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    reqContracts.reverse();
                }

            }
            if (field === 'type') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterType(reqContracts);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    reqContracts.reverse();
                }
            }
            if (field === 'description') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterDescription(reqContracts);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    reqContracts.reverse();
                }
            }
            if (field === 'purchased') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {

                    this.filterTop[index].filter = 'ASC';
                    this.onFilterPurchased(reqContracts);

                } else {

                    this.filterTop[index].filter = 'DESC';
                    reqContracts.reverse();
                }


            }
            if (field === 'used-hours') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterUsedHours(reqContracts);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    reqContracts.reverse();
                }


            }


            if (field === 'left-hours') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterLeftHours(reqContracts);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    reqContracts.reverse();
                }


            }
            if (field === 'exceeding-hours') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterExceedingHours(reqContracts);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    reqContracts.reverse();
                }


            }
            if (field === 'billable-hours') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterBillableHours(reqContracts);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    reqContracts.reverse();
                }


            }
            this.direction = this.filterTop[index].filter;
        }
    }
    /**
   * @description Clear fields 'filter' from object 'filterTop'
   */
    public clearFilter() {
        this.filterTop.forEach(item => item.filter = '');
    }
    /**
  * @description Sort contracts list by companyName
  * @param  {Array<ContractStatisticsItem>} reqContracts  - Array Object contract
  */
    private onFilterCompanyName(reqContracts) {
        reqContracts.sort((a, b) => (a.companyName.toLowerCase() > b.companyName.toLowerCase()) ?
            1 : ((b.companyName.toLowerCase() > a.companyName.toLowerCase()) ? -1 : 0));
    }
    /**
 * @description Sort contracts list by type
 * @param  {Array<ContractStatisticsItem>} reqContracts  - Array Object contract
 */
    private onFilterType(reqContracts) {
        reqContracts.sort((a, b) => (a.type.toLowerCase() > b.type.toLowerCase()) ?
            1 : ((b.type.toLowerCase() > a.type.toLowerCase()) ? -1 : 0));
    }

    /**
  * @description Sort contracts list by description
  * @param  {Array<ContractStatisticsItem>} reqContracts  - Array Object contract
  */
    private onFilterDescription(reqContracts) {
        reqContracts.sort((a, b) => (a.description.toLowerCase() > b.description.toLowerCase()) ?
            1 : ((b.description.toLowerCase() > a.description.toLowerCase()) ? -1 : 0));
    }
    /**
 * @description Sort contracts list by quantity
 * @param  {Array<ContractStatisticsItem>} reqContracts  - Array Object contract
 */
    private onFilterPurchased(reqContracts) {
        reqContracts.sort((a, b) => (a.quantity > b.quantity) ?
            1 : ((b.quantity > a.quantity) ? -1 : 0));
    }
    /**
  * @description Sort contracts list by quantityUsed
  * @param  {Array<ContractStatisticsItem>} reqContracts  - Array Object contract
  */
    private onFilterUsedHours(reqContracts) {
        reqContracts.sort((a, b) => (a.quantityUsed > b.quantityUsed) ?
            1 : ((b.quantityUsed > a.quantityUsed) ? -1 : 0));
    }
    /**
   * @description Sort contracts list by quantityLeft
   * @param  {Array<ContractStatisticsItem>} reqContracts  - Array Object contract
   */
    private onFilterLeftHours(reqContracts) {
        reqContracts.sort((a, b) => (a.quantityLeft > b.quantityLeft) ?
            1 : ((b.quantityLeft > a.quantityLeft) ? -1 : 0));
    }
    /**
    * @description Sort contracts list by quantityExceeding
    * @param  {Array<ContractStatisticsItem>} reqContracts  - Array Object contract
    */
    private onFilterExceedingHours(reqContracts) {
        reqContracts.sort((a, b) => (a.quantityExceeding > b.quantityExceeding) ?
            1 : ((b.quantityExceeding > a.quantityExceeding) ? -1 : 0));
    }
    /**
    * @description Sort contracts list by otherQuantity
    * @param  {Array<ContractStatisticsItem>} reqContracts  - Array Object contract
    */
    private onFilterBillableHours(reqContracts) {
        reqContracts.sort((a, b) => (a.otherQuantity > b.otherQuantity) ?
            1 : ((b.otherQuantity > a.otherQuantity) ? -1 : 0));
    }

}