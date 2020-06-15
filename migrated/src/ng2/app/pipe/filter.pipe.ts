import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(args: any[], reset: boolean, value: string): any {
    
    if (reset)  {
    
      return args;
    }
    if (args) {
      if (!value || value === '') {
        return args
      } else {
        let categories = JSON.parse(JSON.stringify(args));
       categories = categories.filter(item => {
          let products = item.products.filter(product => product.description.toLowerCase().includes(value.toLowerCase()) || product.manufacture && product.manufacture.toLowerCase().includes(value.toLowerCase()) ||product.ilc && product.ilc.toLowerCase().includes(value.toLowerCase()));
          item.products = products;
          return (products.length === 0) ? false : true;
        })
      /*  categories.forEach((item) => {
          item.products = item.products.filter(product => product.description.toLowerCase().includes(value.toLowerCase()));
        })*/

        return categories;

      }
    } else {
      return []
    }
  }

}
