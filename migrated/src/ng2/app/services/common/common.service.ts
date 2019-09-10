import { Injectable } from '@angular/core';

@Injectable()
export class CommonService {

  constructor() { }
  public validateNumber (value,type = 'string') {
   if (type === 'string') return value.replace(/[^0-9\.]/g, '');
   if (type === 'number') return Number(value.replace(/[^0-9\.]/g, ''));
  }
  
}
