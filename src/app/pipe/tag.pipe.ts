import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "tag"
})
export class TagPipe implements PipeTransform {
  transform(items: any, args?: any): any {
    if (!items) return [];
    if (!args) return items;

    args = args.toLowerCase();

    return items.filter(it => {
      return it.word.toLowerCase().includes(args);
    });
  }
}
