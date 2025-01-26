import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'expiredate',
  standalone: true,
})
export class ExpiredatePipe implements PipeTransform {
  transform(date: Date): unknown {
    let currentDate = new Date();
    if (date > currentDate) {
      console.log(date);
      console.log(currentDate);

      return true;
    } else {
      return false;
    }
  }
}
