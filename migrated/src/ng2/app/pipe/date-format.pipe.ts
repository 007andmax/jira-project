import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(data: any[], date ) {
    if (date && data) {
      console.log(date, 'DATE');
      return data.filter((item) => item.expiredDate === date)
    } else {
      return data;
    }
  }
}
