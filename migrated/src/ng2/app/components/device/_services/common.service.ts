import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class CommonServices {
    constructor () {}

    cleanObject(obj) {
      for (var propName in obj) { 
        if (obj[propName] === null || obj[propName] === undefined) {
          delete obj[propName];
        }
      }
      return obj;
    }

    getShortName(name) { 
      return name.split(' ').map(n => n[0]).join('');
    }
}