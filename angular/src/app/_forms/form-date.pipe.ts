import { Pipe, PipeTransform } from '@angular/core';
// import { TimeSpan } from '@shared/service-proxies/service-proxies';

@Pipe({
  name: 'formDate'
})
export class FormDatePipe implements PipeTransform {
  transform(value: any, ...args: any[]) {
    throw new Error('Method not implemented.');
  }

  // transform(value: TimeSpan): string {
  //   // Convert TimeSpan to a string here
  //   return value.hours + ':' + value.minutes + ':' + value.seconds;
  // }

}
