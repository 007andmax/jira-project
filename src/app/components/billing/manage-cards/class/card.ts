export class Card {
    "id": string;
    "maskedCardNumber": string;
    "expiryDate": string;
    "streetnumber": string;
    "streetname": string;
    "zipcode": string;
    "city": string;
    "state": string;
    "country": string;
    "address": string;
    "companyName": string;
    "cardType": string;
    cardholderName: string;
    constructor(data) {
        for (const key in data) {
            this[key] = data[key];
        }
    }
}