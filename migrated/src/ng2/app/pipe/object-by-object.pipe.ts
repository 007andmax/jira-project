import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectByObject$',
  pure: false
})
export class ObjectByObjectPipe implements PipeTransform {

  transform(data: any[], ...args ) {
    console.log(args[0][args[1]].length > 2, '!!!!!');
    console.log(data, '!!!!!');
    if (args[0] && args[0][args[1]].length > 1 && data) {

      return data = data.filter((item) => {
        return item[args[1]].toLowerCase() === args[0][args[1]].toLowerCase()
      });
    } else {
      console.log(2);
      return data;
    }

  }

}
