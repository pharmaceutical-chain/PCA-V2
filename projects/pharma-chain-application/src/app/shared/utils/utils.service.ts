import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  convertToLocalDate(date: Date): Date {
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date;
  }
}
