import { Pipe, PipeTransform } from '@angular/core';
import Inputmask from "inputmask";

@Pipe({
  name: 'phoneNumber'
})
export class PhoneNumberPipe implements PipeTransform {
  transform(value: string, args?: any): string {
    var formattedDate = Inputmask.format(value, {
      mask: "+1 (999) 999-9999 [extn 9999]", greedy: false
    });
    //  // Inputmask({ mask: "+1 (999) 999-9999 [*{1,4}|(,)|(.)] [9999]", greedy: false }).mask(document.getElementById("phone-number-1"));

    console.log("formattedDate", formattedDate);
    return formattedDate.replaceAll('_', '');
  }
}
