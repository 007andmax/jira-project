import { Pipe, PipeTransform } from '@angular/core';

/**
 * Find user in array
 */
@Pipe({
  name: 'user'
})
export class UserPipe implements PipeTransform {

  /**
   * Find user in array
   */
  transform(data: any[], user ) {
    if (user && user.id && data) {
      return data = data.filter((item) => {
        const links = item.links.filter((item) => {
          return (item.userId === user.id || item.deviceId === user.id)
        });
        return links.length > 0;
      });
    } else {
      return data;
    }
  }

}
