export class DocumentLinked {
    users: [];
    companies: [];
    constructor(data) {
        this.users = data.users;
        this.companies = data.companies;
    }
}