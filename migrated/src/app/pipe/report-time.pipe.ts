import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reportTime'
})
export class ReportTimePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
      return "00:00";
    }

    var num = +value;
    var remainder = num - Math.floor(num);

    if (!remainder) {
      return addZero(num) + ':' + '00';
    } else {
      return addZero(Math.floor(num)) + ':' + addZero(Math.round(remainder * 60));
    }


    function addZero(num) {
      if (String(num).length < 2) {
        return '0' + num;
      }

      return num;
    }
  }

}
