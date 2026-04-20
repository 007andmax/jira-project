import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'keysValue',
    standalone: true
})
export class KeysValuePipe implements PipeTransform {

  transform(value: any, sort?: any): any {
    if (value) {
      let list = [];
      for (const key in value) list.push(key);
      return (sort) ? list.sort((a, b) => (a.total > b.total) ?
        1 : ((b.total > a.total) ? -1 : 0)) : list;
    } else {
      return value;
    }
  }

}
