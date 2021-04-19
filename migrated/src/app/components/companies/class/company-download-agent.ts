export class CompanyDownlaodAgent {
    agentName: string;
    agentPassword: string;
    userName: string;
    email: string;
    companyId: string;
    constructor(agentName, agentPassword, userName, email, companyId) {
        this.agentName = agentName;
        this.agentPassword = agentPassword;
        this.userName = userName;
        this.email = email;
        this.companyId = companyId;
    }
}