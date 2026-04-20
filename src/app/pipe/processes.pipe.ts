import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'process',
    pure: false,
    standalone: true
})
export class ProcessesPipe implements PipeTransform {

  transform(data: any[], name ) {
    if (name &&  data) {
      return data.filter((item) => item.Name.toLowerCase().includes(name.toLowerCase()));
    } else {
      return data;
    }
  }
}
