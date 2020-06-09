import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'service',
  pure: false
})
export class ServicePipe implements PipeTransform {

  transform(data: any[], name ) {
    if (name &&  data) {
      return data.filter((item) => item.name.toLowerCase().includes(name.toLowerCase()));
    } else {
      return data;
    }
  }

}
