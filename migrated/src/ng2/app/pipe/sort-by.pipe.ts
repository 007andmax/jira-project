import { Pipe, PipeTransform } from '@angular/core';
import { FilterPasswordManager } from '../components/password-manager/class/filter-password-manager';

@Pipe({
  name: 'sortBy'
})
export class SortByPipe implements PipeTransform {

  transform(args: any[], filter: FilterPasswordManager,selectedCompany , selectedUserOrDevice , selectedDate , selectedCategory): any {
    console.log('filter',filter);
    if (!args) return args;
    let new_args = args.filter(item => {
      let find = true;
      if (selectedCompany && selectedCompany.companyId.length > 0) {
        if (item.companyId === selectedCompany.companyId) {
          find = true;
        } else {
          return false;
        }
      }
      if (filter.user) {
        if (item.user === filter.user) {
          find = true;
        } else {
          return false;
        }
      }
    if (filter.dateFormat) {
        if (item.dateFormat === filter.dateFormat) {
          find = true;
        } else {
          return false;
        }
      }

      if (selectedCategory) {
        if (item.template !== selectedCategory.UPPERCASE) return false;
      }


      return true;

    });

    console.log('new_args', new_args);
    if (filter.direction) {
      let out_args = new_args.sort((a, b) => {
        if (a[filter.sort] && b[filter.sort]) {
          return ((a[filter.sort].toLowerCase() > b[filter.sort].toLowerCase()) ?
            1 : ((b[filter.sort].toLowerCase() > a[filter.sort].toLowerCase()) ? -1 : 0));
        } else if (a[filter.sort]) {
          return 1
        } else if (b[filter.sort]) {
          return -1
        }
        return 0;
      });
      return (filter.direction === 'ASC') ? out_args : out_args.reverse();
    }
    return new_args;
  }

}
