import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'serv',
    pure: false,
    standalone: true
})
export class DeviceServicePipe implements PipeTransform {

  transform(data: any[], name ) {
    if (name &&  data) {
      return data.filter((item) => item.DisplayName.toLowerCase().includes(name.toLowerCase()));
    } else {
      return data;
    }
  }
}


