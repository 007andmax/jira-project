import { Pipe, PipeTransform } from '@angular/core';

/**
 * filter date
 */
@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  /**
   * filter date
   */
  transform(data: any[], date ) {
    if (date && data) {
      return data.filter((item) => item.expiredDate === date)
    } else {
      return data;
    }
  }
}
