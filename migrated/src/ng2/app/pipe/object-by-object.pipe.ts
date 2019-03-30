import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectByObject$',
  pure: false
})
export class ObjectByObjectPipe implements PipeTransform {

  transform(data: any[], ...args ) {
    if (args[0] && args[0][args[1]] && data) {
      console.log(11);
      return data = data.filter((item) => {
        return item[args[1]].toLowerCase() === args[0][args[1]].toLowerCase()
      });
    } else {
      return data;
    }

  }

}
