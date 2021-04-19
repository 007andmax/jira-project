import { CurrentUserCompany } from './current-user-company';
import { UserStatistic } from '../../app/components/users/class/user-statistic';
import { CompanyLogo } from '../../app/components/companies/class/company-logo';
import { CurrentUserWizardTracker } from './current-user-wizard-tracker';

export class CurrentUser {
    id: string = null;
    company: CurrentUserCompany;
    firstName: string;
    lastName: string;
    phoneNumbers: []
    status: string;
    primaryEmail: string;
    secondaryEmail: string;
    deletedAt: number;
    role: string;
    techRole: string;
    startPage: string;
    companiesGridPresentation: string;
    usersGridPresentation: string;
    userStatistic: UserStatistic;
    avatar: CompanyLogo;
    online: boolean;
    isEmailVerified: boolean;
    isContact: boolean;
    userEnabled: boolean;
    isDefault: boolean;
    priority: number
    designation: string;
    subscription: null
    enableTwoFactorAuth: boolean;
    twoFactorAuthType: string;
    isOwner: boolean;
    disabledWelcomeWizard: boolean
    requestToChangePassword: boolean
    wizardTracker: CurrentUserWizardTracker;
    permissions: Array<string>  = [];
    myTicketUpdated: null
    owner: boolean;
    emailVerified: boolean;
    accountType: string;
    contact: boolean;
    default: boolean;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
              //  if (this.hasOwnProperty(key)) {
                    this[key] = data[key];
                    
               // }
            }
        }
     }

    public checkPermission(data) {
        return this.permissions.includes(data);
    }
}