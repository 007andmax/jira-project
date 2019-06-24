import { Pipe, PipeTransform } from '@angular/core';

/**
 * find category
 */
@Pipe({
  name: 'passwordCategory'
})
export class PasswordCategoryPipe implements PipeTransform {

  /**
   * find category
   */
  transform(data: any, category: any): any {
    if (category && data && category['UPPERCASE'] !== 'CLEAR') {
      return data.filter((item) => {
        return item.template.toLowerCase() === category['UPPERCASE'].toLowerCase();
      });
    } else {
      return data;
    }
  }

}
