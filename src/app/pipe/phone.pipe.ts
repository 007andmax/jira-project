import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "phone"
})
export class PhonePipe implements PipeTransform {
  transform(value: string, args?: any): string {
    return (value.length > 0) ? `+1 ${value}` : value;
  }
}
