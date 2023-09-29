import { FilterListTop } from "src/class/list/filter-list-top";

export class ContractStatisticsFilter {
    filterTop: Array<FilterListTop> = [new FilterListTop('company-name', ''),
    new FilterListTop('type', ''),
    new FilterListTop('description', ''),
    new FilterListTop('purchased', ''),
    new FilterListTop('used-hours', ''),
    new FilterListTop('left-hours', ''),
    new FilterListTop('exceeding-hours', ''),
    new FilterListTop('billable-hours', '')];

    /**
     * @description Sort users list by field
     * @param  {string} field  - field for sort
     * @param  {Array<User>} reqUsers  - user list for sort
     * @param  {Array<Company>} companies  - company 
     * @param  {Array<CrmCompanyIndustry>} industries  - CrmCompanyIndustry list
     */
    public onFilter(field, reqUsers) {

        let index = this.filterTop.findIndex(item => item.field === field);
        if (index > -1) {
            let sort = this.filterTop[index].filter;
            if (field === 'company-name') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterCompanyName(reqUsers);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    reqUsers.reverse();
                }

            }
            if (field === 'type') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterType(reqUsers);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    reqUsers.reverse();
                }
            }
            if (field === 'description') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterDescription(reqUsers);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    reqUsers.reverse();
                }
            }
            if (field === 'purchased') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {

                    this.filterTop[index].filter = 'ASC';
                    this.onFilterPurchased(reqUsers);

                } else {

                    this.filterTop[index].filter = 'DESC';
                    reqUsers.reverse();
                }


            }
            if (field === 'used-hours') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterUsedHours(reqUsers);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    reqUsers.reverse();
                }


            }


            if (field === 'left-hours') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterLeftHours(reqUsers);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    reqUsers.reverse();
                }


            }
            if (field === 'exceeding-hours') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterExceedingHours(reqUsers);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    reqUsers.reverse();
                }


            }
            if (field === 'billable-hours') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterBillableHours(reqUsers);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    reqUsers.reverse();
                }


            }

        }
    }
    /**
   * @description Clear fields 'filter' from object 'filterTop'
   */
    public clearFilter() {
        this.filterTop.forEach(item => item.filter = '');
    }
    /**
  * @description Sort user list by FirstName and LastName
  * @param  {Array<User>} reqUsers  - Array Object user
  */
    private onFilterCompanyName(reqUsers) {
        reqUsers.sort((a, b) => (a.companyName.toLowerCase() > b.companyName.toLowerCase()) ?
            1 : ((b.companyName.toLowerCase() > a.companyName.toLowerCase()) ? -1 : 0));
    }
    /**
 * @description Sort user list by FirstName and LastName
 * @param  {Array<User>} reqUsers  - Array Object user
 */
    private onFilterType(reqUsers) {
        reqUsers.sort((a, b) => (a.type.toLowerCase() > b.type.toLowerCase()) ?
            1 : ((b.type.toLowerCase() > a.type.toLowerCase()) ? -1 : 0));
    }

    /**
 * @description Sort user list by FirstName and LastName
 * @param  {Array<User>} reqUsers  - Array Object user
 */
    private onFilterDescription(reqUsers) {
        reqUsers.sort((a, b) => (a.description.toLowerCase() > b.description.toLowerCase()) ?
            1 : ((b.description.toLowerCase() > a.description.toLowerCase()) ? -1 : 0));
    }
    /**
    * @description Sort user list by FirstName and LastName
    * @param  {Array<User>} reqUsers  - Array Object user
    */
    private onFilterPurchased(reqUsers) {
        reqUsers.sort((a, b) => (a.quantity > b.quantity) ?
            1 : ((b.quantity > a.quantity) ? -1 : 0));
    }
    /**
   * @description Sort user list by FirstName and LastName
   * @param  {Array<User>} reqUsers  - Array Object user
   */
    private onFilterUsedHours(reqUsers) {
        reqUsers.sort((a, b) => (a.quantityUsed > b.quantityUsed) ?
            1 : ((b.quantityUsed > a.quantityUsed) ? -1 : 0));
    }
    /**
      * @description Sort user list by FirstName and LastName
      * @param  {Array<User>} reqUsers  - Array Object user
      */
    private onFilterLeftHours(reqUsers) {
        reqUsers.sort((a, b) => (a.quantityLeft > b.quantityLeft) ?
            1 : ((b.quantityLeft > a.quantityLeft) ? -1 : 0));
    }
    /**
    * @description Sort user list by FirstName and LastName
    * @param  {Array<User>} reqUsers  - Array Object user
    */
    private onFilterExceedingHours(reqUsers) {
        reqUsers.sort((a, b) => (a.quantityExceeding > b.quantityExceeding) ?
            1 : ((b.quantityExceeding > a.quantityExceeding) ? -1 : 0));
    }
    /**
  * @description Sort user list by FirstName and LastName
  * @param  {Array<User>} reqUsers  - Array Object user
  */
    private onFilterBillableHours(reqUsers) {
        reqUsers.sort((a, b) => (a.otherQuantity > b.otherQuantity) ?
            1 : ((b.otherQuantity > a.otherQuantity) ? -1 : 0));
    }

}