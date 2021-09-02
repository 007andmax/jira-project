import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'beta'
})

export class DeviceBeta implements PipeTransform{
  transform(items: any, args?: any): any {
    if (!items) return [];
    if (!args) return items;

    args = args.toLowerCase();

    return items.filter(it => {
      return it.Name.toLowerCase().includes(args);
    });
  }
}

