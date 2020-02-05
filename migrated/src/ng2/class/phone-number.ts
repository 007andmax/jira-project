export class PhoneNumber {
    typeNumber: string = '';
     number: string = '';
     constructor(type = null,number = null) {
       if (type)  this.typeNumber = type
       if (number)  this.number = number
     }
}