import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'deviceTag',
    standalone: true
})
export class DeviceTagPipe implements PipeTransform {

  transform(items: any, args?: any): any {
    if (!items) return [];
    if (!args) return items;

    args = args.toLowerCase();

    return items.filter(it => {
      return it.name.toLowerCase().includes(args);
    });
  }

}
