import { Pipe, PipeTransform } from '@angular/core';
import { FilterPasswordManager } from '../components/password-manager/class/filter-password-manager';

@Pipe({
  name: 'sortBy'
})
export class SortByPipe implements PipeTransform {

  transform(args: any[], sort: string,direction: string): any {
   
    if (!args) return args;
    let new_args = args;/*.filter(item => {
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

    });*/

    
    if (direction) {
      let out_args = new_args.sort((a, b) => {
        if (a[sort] && b[sort]) {
          return ((a[sort].toLowerCase() > b[sort].toLowerCase()) ?
            1 : ((b[sort].toLowerCase() > a[sort].toLowerCase()) ? -1 : 0));
        } else if (a[sort]) {
          return 1
        } else if (b[sort]) {
          return -1
        }
        return 0;
      });
      return (direction === 'ASC') ? out_args : out_args.reverse();
    }
    return new_args;
  }

}
