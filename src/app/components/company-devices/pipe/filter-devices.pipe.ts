import { Pipe, PipeTransform } from '@angular/core';
import { CompanyDeviceFilter } from '../class/device-company-filter';

@Pipe({
  name: 'filterDevices',
  pure: false
})
export class FilterDevicesPipe implements PipeTransform {

  transform(items: any[], filter: CompanyDeviceFilter): any {
    let filtesList = [];
    if (filter.isAgent && filter.isCustomDevices) {
      if (filter.assestType.length > 0) {

        return items.filter(item => filter.assestType.some(filteritem => filteritem.toLocaleLowerCase() == ((item.isCustom) ? item.type.toLocaleLowerCase() : (item.iconName || item.type).toLocaleLowerCase())));
      }
      return items;
    } else if (filter.isAgent) {
      filtesList = items.filter(item => !item.isCustom);
    } else if (filter.isCustomDevices) {
      filtesList = items.filter(item => item.isCustom);
    }
    if (filter.assestType.length > 0) return filtesList.filter(item => filter.assestType.some(filteritem => filteritem.toLocaleLowerCase() == ((item.isCustom) ? item.type.toLocaleLowerCase() : (item.iconName || item.type).toLocaleLowerCase())));
    return filtesList;
  }

}
