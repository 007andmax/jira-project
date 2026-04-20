import { Pipe, PipeTransform } from "@angular/core";
import { interval } from "rxjs";

@Pipe({
    name: "startupSearch",
    standalone: true
})
export class StartUpProgramPipe implements PipeTransform {
  transform(items: any, args?: any): any {
    if (!items) return [];
    if (!args) return items;

    args = args.toLowerCase();

    return  items.filter(it => {
      return it.Name.toLowerCase().includes(args);
    });
  }
}
