import { FilterListTop } from 'src/ng2/class/list/filter-list-top';

export class CompanyDeviceFilter {
    filterTop: Array<FilterListTop> = [new FilterListTop('name', 'ASC'),
    new FilterListTop('user_name', ''),
    new FilterListTop('up_time', '')];
    constructor() { }

    public onFilter(field, devices) {

        let index = this.filterTop.findIndex(item => item.field === field);
        if (index > -1) {
            let sort = this.filterTop[index].filter;
            if (field === 'name') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterName(devices);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    devices.reverse();
                }

            }
            if (field === 'user_name') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {

                    this.filterTop[index].filter = 'ASC';
                    this.onFilterUserName(devices);

                } else {

                    this.filterTop[index].filter = 'DESC';
                    devices.reverse();
                }


            }
            if (field === 'up_time') {
                this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filterTop[index].filter = 'ASC';
                    this.onFilterUpTimeASC(devices);
                } else {
                    this.filterTop[index].filter = 'DESC';
                    this.onFilterName(devices);
                }


            }
        }
    }

    private onFilterUpTimeASC(devices) {
        devices.sort((a, b) => (((a.online) ? a.timing.uptimeForOrdering : 0) > (b.online) ? b.timing.uptimeForOrdering : 0) ?
            1 : (((b.online) ? b.timing.uptimeForOrdering : 0 > (a.online) ? a.timing.uptimeForOrdering : 0) ? -1 : 0));
    }
    private onFilterUserName(devices) {
        devices.sort((a, b) => (this.getUserName(a).toLowerCase() > this.getUserName(b).toLowerCase()) ?
            1 : ((this.getUserName(b).toLowerCase() > this.getUserName(a).toLowerCase()) ? -1 : 0));
    }
    private getUserName(device) {
        return device.userName || '';
    }
    private onFilterName(devices) {
        devices.sort((a, b) => (this.getNameDevice(a).toLowerCase() > this.getNameDevice(b).toLowerCase()) ?
            1 : ((this.getNameDevice(b).toLowerCase() > this.getNameDevice(a).toLowerCase()) ? -1 : 0));
    }
    private getNameDevice(device) {
        return device.label || device.hostName || device.ip
    }
    public clearFilter() {
        this.filterTop.forEach(item => item.filter = '');
    }
}