import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectByObject$',
  pure: false
})
export class ObjectByObjectPipe implements PipeTransform {

  transform(data: any[], ...args ) {

    if (args[0] && args[0][args[1]]) {
      return data = data.filter((item) => {
        if ( item[args[1]] === args[0][args[1]]) {
        }
        return item[args[1]] === args[0][args[1]]
      });
    } else {
      return data;
    }

  }

}
