import { CurrentUserCompany } from './current-user-company';
import { UserStatistic } from '../../app/components/users/class/user-statistic';
import { CompanyLogo } from '../../app/components/companies/class/company-logo';
import { CurrentUserWizardTracker } from './current-user-wizard-tracker';
import { CrmCompanyJobTitle } from 'src/app/components/setting/crm-settings/crm-company-job-title/class/crm-company-job-title';

export class CurrentUser {
    id: string = null;
    company: CurrentUserCompany;
    firstName: string;
    lastName: string;
    phoneNumbers: []
    status: string;
    email: string;
    primaryEmail: string;
    secondaryEmail: string;
    deletedAt: number;
    role: string;
    techRole: string;
    startPage: string;
    jobTitle: CrmCompanyJobTitle;
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
    subscription: null
    enableTwoFactorAuth: boolean;
    twoFactorAuthType: string;
    isOwner: boolean;
    disabledWelcomeWizard: boolean
    requestToChangePassword: boolean
    wizardTracker: CurrentUserWizardTracker;
    permissions: Array<string> = [];
    myTicketUpdated: null
    owner: boolean;
    emailVerified: boolean;
    accountType: string;
    contact: boolean;
    default: boolean;
    jobTitleId: string;
    jobTypeId: string;
    userTOTP: any;
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