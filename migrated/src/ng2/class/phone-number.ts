export class PhoneNumber {
    typeNumber: string = '';
     number: string = '';
     constructor(type = null) {
       if (type)  this.typeNumber = type
     }
}