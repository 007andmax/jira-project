import { Tax } from 'src/app/interfaces/service/tax';
import { VersionedId } from 'src/app/interfaces/versioned-id';
import { NonContractServices } from '../../../non-contract-services/class/non-contract-service';
import { ContractsHourlyService } from './contracts-hourly-service';

export class DefaultServicesHourlyContract extends NonContractServices {
    selected: boolean = false;
    isCopy: boolean = false;
    rate_str: string;
    constructor(data = null) {
        super(data);
        this.rate_str = this.rate.toFixed(2);
    }
    public setDataFromCopy(data: ContractsHourlyService, taxesList: Array<Tax>) {
        this.selected = true;
        this.billable = data.billable;
        this.commissionRate = data.commissionRate;
        this.versionedId = new VersionedId();
        this.versionedId.id = data.id;
        this.name = data.name;
        this.rate = data.rate;
        this.rate_str = this.rate.toFixed(2);
        this.taxes = taxesList.filter(item => {
            let find = data.taxIds.find(taxId => taxId === item.id);
            return (find) ? true : false;
        })
    }
}