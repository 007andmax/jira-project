import { Injectable } from '@angular/core';

@Injectable()
export class CommonService {

  constructor() { }
  public validateNumber (value) {
    return value.replace(/[^0-9\.]/g, '')

  }
}
