import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'company',
  pure: false
})
export class CompanyPipe implements PipeTransform {

  transform(data: any[], company ) {
    if (company && company.companyId && data) {
      return data.filter((item) => {
        return item.companyId.toLowerCase() === company.companyId.toLowerCase();
      });
    } else {
      return data;
    }
  }

}
