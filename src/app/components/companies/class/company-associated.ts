export class CompanyAssociated {
    addresses: []
    contacts: []
    id: string;
    constructor(data) {
        this.addresses = data.addresses;
        this.contacts = data.contacts;
        this.id = data.id;
    }
}