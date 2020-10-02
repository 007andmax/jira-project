import { Tax } from 'src/ng2/app/interfaces/service/tax';
import { DefaultServices } from '../../../default-services/class/default-service';
import { ContractsHourlyService } from './contracts-hourly-service';

export class DefaultServicesHourlyContract extends DefaultServices {
    selected: boolean = false;
    
    public setDataFromCopy(data: ContractsHourlyService, taxesList: Array<Tax>) {
        this.selected = true;
        this.billable = data.billable;
        this.commissionRate = data.commissionRate;
        this.versionedId.id = data.id;
        this.name = data.name;
        this.rate = data.rate;
        this.taxes = taxesList.filter(item => {
            let find = data.taxIds.find(taxId => taxId === item.id);
            return (find) ? true : false;
        })

    }
}