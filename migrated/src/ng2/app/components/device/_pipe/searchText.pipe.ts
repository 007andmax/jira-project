import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'searchText'
})
export class searchTextPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if(!items) return [];
    if(!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter( it => {
        let name = it.firstName.toLowerCase() + ' ' + it.lastName.toLowerCase(); 
        let email = it.primaryEmail.toLowerCase();
        return name.toLowerCase().includes(searchText) || email.toLowerCase().includes(searchText);
    });
   } 
}