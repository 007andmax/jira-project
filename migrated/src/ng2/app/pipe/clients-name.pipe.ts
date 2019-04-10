import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clientsName'
})
export class ClientsNamePipe implements PipeTransform {

  transform(data: any[], client ) {
    console.log(data, name);
    return data;
  }

}
