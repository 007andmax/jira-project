export class TicketCreatedUser {
    companyId: string;
    firstName: string;
    id: string;
    primaryEmail: string;
    constructor() {

    }
    /**
* @description Set new value "companyId"
* @param {String} companyId - new value companyId
*/
    public setCompanyId(companyId) {
        this.companyId = companyId;
    }
    /**
* @description Set new values for fields "firstName" "id" "primaryEmail"
* @param {Object} data - Object of User
*/
    public setUserData(data) {
        this.firstName = data.firstName;
        this.id = data.id;
        this.primaryEmail = data.primaryEmail;
    }
    /**
* @description Clear fields values "firstName" "id" "primaryEmail"
*/
    public clearUserData() {
        this.firstName = null;
        this.id = null;;
        this.primaryEmail = null;
    }
}