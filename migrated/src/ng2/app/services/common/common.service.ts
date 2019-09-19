import { Injectable } from '@angular/core';

@Injectable()
export class CommonService {

  constructor() { }
  public validateNumber (value) {
    return value.replace(/[^0-9\.]/g, '')

  }
  private staticCopy(inst) {

    var instCopy,
      copyProps = inst;

    if (!copyProps && this && this.staticCopy) {
      copyProps = this;
    }

    if (Object.prototype.toString.call(copyProps) === '[object Array]') {

      instCopy = [];

      for (var i = 0; i < copyProps.length; i++) {
        instCopy.push(this.staticCopy(copyProps[i]));
      }

    } else if (Object.prototype.toString.call(copyProps) === '[object Object]') {

      instCopy = {};

      for (var prop in copyProps) {

        if (prop === 'staticCopy' || prop == '$$hashKey') {
          continue;
        }

        instCopy[prop] = this.staticCopy(copyProps[prop]);
      }
    } else {
      return copyProps;
    }

    return instCopy;
  }
  public customizeObj(sourceObj, targetObj) {
    if (Object.prototype.toString.call(sourceObj) === '[object String]')  return sourceObj;

    targetObj = targetObj || sourceObj;
    for (let prop in sourceObj) {

      let value = sourceObj[prop];

      if (Object.prototype.toString.call(value) === '[object Array]') {
        this.customizeArray(value);
      } else if (Object.prototype.toString.call(value) === '[object Object]') {
        customizeObj(value);
      }
      defineProperty(targetObj, prop, value);
    }
    defineProperty(targetObj, 'staticCopy', this.staticCopy);
    return targetObj;

  }
  private customizeArray(source, target=null) {
    if (target) {
      for (let i = 0; i < source.length; i++) {
        target.push(customizeObj(source[i]));
      }
      this.defineProperty(target, 'staticCopy', this.staticCopy);
      return target;
    }
    for (var i = 0; i < source.length; i++) {
      source[i] = customizeObj(source[i]);
    }
    this.defineProperty(source, 'staticCopy', this.staticCopy);
    return source;
  }

  private defineProperty(obj, prop, value) {
    if (obj && prop != null) {
      Object.defineProperty(obj, prop, {
        value: value,
        writable: true,
        enumerable: true,
        configurable: true
      })
    }
  }
}
