import { Pipe, PipeTransform } from '@angular/core';

/**
 * transfrom to number
 */
@Pipe({
  name: 'toNumer'
})
export class ToNumerPipe implements PipeTransform {

  /**
   * transfrom to number
   */
  transform(value: any, args?: any): any {
    return null;
  }

}
