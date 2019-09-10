import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(args: any[], prop: string, value: string ): any {
console.log('args',args);
console.log('prop',prop);
console.log('value',value);
    if (args) {
      if (!value || value === '') {
        return args
      } else {
        let categories =  args.filter(item => {
          let products =item.products.filter(product => product.description.toLowerCase().includes(value.toLowerCase()));
          return (products.length === 0) ? false : true;
        })
        categories.forEach((item) => {
          item.products = item.products.filter(product => product.description.toLowerCase().includes(value.toLowerCase()));
        })
        
        return categories;
        
      }
    } else {
      return []
    }
  }

}
