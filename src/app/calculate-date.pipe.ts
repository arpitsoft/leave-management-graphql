import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calculateDate'
})
export class CalculateDatePipe implements PipeTransform {

  transform(fromDate: string | Date, toDate: string | Date) {

    if (!fromDate || !toDate) return 0

    let start = new Date(fromDate);
    let end = new Date(toDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0

    const diff = end.getTime() - start.getTime();
    
    const date = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    return date >= 0 ? date + 1 + ' Days' : 0 + ' Days';
  }

}
