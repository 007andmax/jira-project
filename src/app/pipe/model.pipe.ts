import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "modelFilter",
    standalone: true
})
export class ModelPipe implements PipeTransform {
  transform(items: any, args?: any): any {
    if (!items) return [];
    if (!args) return items;

    args = args.toLowerCase();

    return items.filter(it => {
      return it.Name.toLowerCase().includes(args);
    });
  }
}
