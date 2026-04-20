import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'toFixed',
    standalone: true
})
export class ToFixedPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.toFixed(args);
  }

}
