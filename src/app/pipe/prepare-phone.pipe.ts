import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'preparePhone'
})
export class PreparePhonePipe implements PipeTransform {

  transform(value: any, args?: any): any {

    if (value[0] === "+" && value[1] === "1") return value.substring(2);
    if (value[0] === "1") return value.substring(1);
    return value;
  }

}
