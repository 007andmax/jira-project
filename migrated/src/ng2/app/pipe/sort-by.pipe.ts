import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortBy'
})
export class SortByPipe implements PipeTransform {

  transform(args: any[], sort: string, direction: string): any {
    if (direction && args) {
     let new_args = args.sort((a, b) => {
        if (a[sort] && b[sort]) {
          return ((a[sort].toLowerCase() > b[sort].toLowerCase()) ?
            1 : ((b[sort].toLowerCase() > a[sort].toLowerCase()) ? -1 : 0));
        } else if (a[sort]) {
          return 1
        } else if (b[sort]) {
          return -1
        }
        return 0;
      });
      return (direction === 'ASC') ?  new_args : new_args.reverse();
    }
    return args;
  }

}
