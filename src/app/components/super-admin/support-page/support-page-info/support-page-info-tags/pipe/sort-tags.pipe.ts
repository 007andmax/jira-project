import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortTags',
  pure: false
})
export class SortTagsPipe implements PipeTransform {

  transform(value: any[], reqTags): any {
    if (!value) return value;
    let new_args = value;
    let out_args = new_args.sort((a, b) => {
      if (this.getSelectedTag(a, reqTags).word && this.getSelectedTag(b, reqTags).word) {
        return ((this.getSelectedTag(a, reqTags).word.toLowerCase() > this.getSelectedTag(b, reqTags).word.toLowerCase()) ?
          1 : ((this.getSelectedTag(b, reqTags).word.toLowerCase() > this.getSelectedTag(a, reqTags).word.toLowerCase()) ? -1 : 0));
      } else if (this.getSelectedTag(a, reqTags).word) {
        return 1
      } else if (this.getSelectedTag(b, reqTags).word) {
        return -1
      }
      return 0;
    });
    return out_args;
  }
  getSelectedTag(id, reqTags) {
    return (reqTags.length > 0) ? reqTags.find(item => item.id === id) : '';
  }
}
