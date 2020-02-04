import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deviceUser'
})
export class DeviceUserPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
