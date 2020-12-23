import { CompanyFilterTop } from "../../companies/class/company-filter-top";
import { CompanyNetworkScanService } from "../services/company-network-scan.service";

export class NetworkScanFilter {
    filter: Array<CompanyFilterTop> = [new CompanyFilterTop('name', 'ASC'),
    new CompanyFilterTop('ipAddress', ''),
    new CompanyFilterTop('manufacturer', ''),
    new CompanyFilterTop('macAddress', ''),
    new CompanyFilterTop('agentStatus', '')];
    constructor(private companyNetworkScanService: CompanyNetworkScanService) { }


    sortByCurrentFilter(list) {
        let index = this.filter.findIndex(item => item.filter !== '');
        let field = this.filter[index].field;
        let sort = this.filter[index].filter;
        if (field === 'name') {
            if (sort === 'DESC') {
                this.onFilterName(list);
                list.reverse();
            } else {
                this.onFilterName(list);
            }
        }
        if (field === 'ipAddress') {
            if (sort === 'DESC') {
                this.onFilterIpAddress(list);
                list.reverse();
            } else {
                this.onFilterIpAddress(list);
            }
        }
        if (field === 'manufacturer') {
            if (sort === 'DESC') {
                this.onFilterManufacturer(list);
                list.reverse();
            } else {
                this.onFilterManufacturer(list);
            }
        }
        if (field === 'macAddress') {
            if (sort === 'DESC') {
                this.onFilterMacAddress(list);
                list.reverse();
            } else {
                this.onFilterMacAddress(list);
            }
        }
        if (field === 'agentStatus') {
            if (sort === 'DESC') {
                this.onFilterAgentStatus(list);
                list.reverse();
            } else {
                this.onFilterAgentStatus(list);
            }
        }

    }
    onSort(field, list) {
        let index = this.filter.findIndex(item => item.field === field);
        if (index > -1) {
            let sort = this.filter[index].filter;
            if (field === 'name') {
                if (sort === '') this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.onFilterName(list);
                } else {
                    this.filter[index].filter = 'DESC';
                    list.reverse();
                }
            }
            if (field === 'ipAddress') {
                if (sort === '') this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.onFilterIpAddress(list);
                } else {
                    this.filter[index].filter = 'DESC';
                    list.reverse();
                }
            }
            if (field === 'manufacturer') {
                if (sort === '') this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.onFilterManufacturer(list);
                } else {
                    this.filter[index].filter = 'DESC';
                    list.reverse();
                }
            }
            if (field === 'macAddress') {
                if (sort === '') this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.onFilterMacAddress(list);
                } else {
                    this.filter[index].filter = 'DESC';
                    list.reverse();
                }
            }
            if (field === 'agentStatus') {
                if (sort === '') this.clearFilter();
                if (sort === '' || sort === 'DESC') {
                    this.filter[index].filter = 'ASC';
                    this.onFilterAgentStatus(list);
                } else {
                    this.filter[index].filter = 'DESC';
                    list.reverse();
                }
            }

        }
    }

    private onFilterAgentStatus(list) {
        list.sort((a, b) => (this.companyNetworkScanService.getStatusText(a) > this.companyNetworkScanService.getStatusText(b) ?
            1 : ((this.companyNetworkScanService.getStatusText(b) > this.companyNetworkScanService.getStatusText(a) ? -1 : 0))));
    }
    private onFilterMacAddress(list) {
        list.sort((a, b) => (a.macAddress.toLowerCase() > b.macAddress.toLowerCase()) ?
            1 : ((b.macAddress.toLowerCase() > a.macAddress.toLowerCase()) ? -1 : 0));
    }
    private onFilterManufacturer(list) {
        list.sort((a, b) => (a.manufacturer.toLowerCase() > b.manufacturer.toLowerCase()) ?
            1 : ((b.manufacturer.toLowerCase() > a.manufacturer.toLowerCase()) ? -1 : 0));
    }
    private onFilterIpAddress(list) {
        list.sort((a, b) => (a.ipAddress.toLowerCase() > b.ipAddress.toLowerCase()) ?
            1 : ((b.ipAddress.toLowerCase() > a.ipAddress.toLowerCase()) ? -1 : 0));
    }
    private onFilterName(list) {
        list.sort((a, b) => (this.getLabel(a).toLowerCase() > this.getLabel(b).toLowerCase()) ?
            1 : ((this.getLabel(b).toLowerCase() > this.getLabel(a).toLowerCase()) ? -1 : 0));
    }
    public clearFilter() {
        this.filter.forEach(item => item.filter = '');
    }
    getLabel(device) {
        return `${(this.checkUnknown(device.description) || this.checkUnknown(device.hostName) || this.checkUnknown(device.ipAddress))}`;
    }
    checkUnknown(value) {
        return (value === "unknown") ? null : value;
    }
}