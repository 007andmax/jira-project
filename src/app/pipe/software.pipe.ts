import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "soft"
})
export class SoftwarePipe implements PipeTransform {
  transform(items: any, args?: any): any {
    if (!items) return [];
    if (!args) return items;

    args = args.toLowerCase();

    return items.filter(it => {
      return it.DisplayName.toLowerCase().includes(args);
    });
  }
}
