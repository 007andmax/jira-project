import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toNumer'
})
export class ToNumerPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    console.log(value);
    return null;
  }

}
