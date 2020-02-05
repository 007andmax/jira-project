import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationFilter'
})
export class DurationFilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
      return "00:00";
    }

    var timeInMinutes = value * 60,
      hours = Math.floor(timeInMinutes / 60),
      minutes = Math.round(timeInMinutes - (hours * 60));

    return (hours >= 10 ? hours : '0' + hours) + ':' + (minutes >= 10 ? minutes : '0' + minutes);
  }

}
