import { CompanyAndress } from 'src/ng2/app/interfaces/company/company-address';

import { CompanyAndressContact } from 'src/ng2/app/interfaces/company/company-address-contact';
import { WorkDay } from './work-day';
import { CompanyService } from './company-service';
import { CompanyProfileContact } from './company-profile-contact';
import { CompanyProfileAddress } from './company-profile-address';
import { Weeks } from '../../shared/interval/config/enums';
import { CompanyLogo } from './company-logo';
import { ImageCropper } from '../../shared/image-cropper/class/image-cropper';
import { Company } from 'src/ng2/app/interfaces/company/company';
import { Tag } from 'src/ng2/app/interfaces/tag/tag';

export class CompanyProfile {
    accountNumber: any;
    addresses: Array<CompanyProfileAddress>;
    agentLinkToEmail: any = null;
    clientIndustry: any = {};
    clientType: string = '';
    contacts: Array<CompanyProfileContact>;
    defaultPaymentMethod: any = null;
    description: string;
    logo: CompanyLogo;
    domain: string;
    login: string = "";
    maxAgents: number = 0;
    name: string;
    password: string = "";
    paymentMethods: string;
    paymentTerms: number;
    serviceType: string;
    removeOfflineTime: number = 30;
    services: Array<CompanyService>;
    workingDays: Array<WorkDay>;
    techLeadId: string;
    id:string;
    tags:Array<Tag>;
    constructor() {
        this.logo = null;
        let contact: CompanyProfileContact = new CompanyProfileContact();
        let address: CompanyProfileAddress = new CompanyProfileAddress();
        address.shortVersion(contact);
        this.addresses = [address];
        this.contacts = [contact];
        this.workingDays = Weeks.map((item) => new WorkDay(item.toUpperCase(), 0, 0))
    }
    public setTags (data) {
        this.tags = data;
    }
    public onEditMode(company: CompanyProfile) {
        this.id = company.id;
        this.accountNumber = company.accountNumber;
        this.addresses = company.addresses;
        this.agentLinkToEmail = company.agentLinkToEmail;
        this.clientIndustry = company.clientIndustry;
        this.clientType = company.clientType;
        this.contacts = company.contacts;
        this.defaultPaymentMethod = company.defaultPaymentMethod;
        this.description = company.description;
        this.logo = company.logo;
        this.domain = company.domain;
        this.login = company.login;
        this.maxAgents = company.maxAgents;
        this.name = company.name;
        this.password = company.password;
        this.paymentMethods = (company.paymentMethods) ? company.paymentMethods : null;
        this.paymentTerms = company.paymentTerms;
        this.serviceType = company.serviceType;
        this.removeOfflineTime = company.removeOfflineTime;
        this.services = company.services;
        this.workingDays = company.workingDays;
        this.techLeadId = company.techLeadId;
        if (this.addresses[0].phoneNumbers.length === 0)
        {
            this.addresses[0].phoneNumbers = [{
                number: '',
                typeNumber: 'OFFICE'
            }];
        }
        if (this.contacts[0].phoneNumbers.length === 0)
        {
            this.contacts[0].phoneNumbers = [{
                number: '',
                typeNumber: 'OFFICE'
            }];
        }
        if (!company.clientIndustry) {
            this.clientIndustry = {
                name: null
            }
        }

    }
    public editLogo (data: ImageCropper) {
        this.logo.base64 = data.croppedImage.base64;
        this.logo.w = data.croppedImage.width;
        this.logo.h = data.croppedImage.width;
        this.logo.x = data.croppedImage.imagePosition.x1;
        this.logo.y = data.croppedImage.imagePosition.y1;
    }
    public setLogo(data: ImageCropper) {
        this.logo = new CompanyLogo();
        this.logo.base64 = data.croppedImage.base64;
        this.logo.origin.id = data.id;
        this.logo.w = data.croppedImage.width;
        this.logo.h = data.croppedImage.width;
        this.logo.x = data.croppedImage.imagePosition.x1;
        this.logo.y = data.croppedImage.imagePosition.y1;

    }
    public fullVersion() {
        let contact: CompanyProfileContact = new CompanyProfileContact();
        contact.fullVersion();
        let address: CompanyProfileAddress = new CompanyProfileAddress();
        address.fullVersion();
        this.agentLinkToEmail = null;
        this.clientIndustry = {
            name: null
        };
        this.clientType = '';
        this.description = null;
        this.domain = null;
        this.login = '';
        this.name = "";
        this.paymentMethods = null;
        this.paymentTerms = null;
        this.serviceType = null;
        this.techLeadId = null;
        this.addresses = [address];
        this.contacts = [contact];
        this.workingDays = Weeks.map((item) => new WorkDay(item.toUpperCase(), 0, 0))

    }

    public onCheckFullVersion() {
        if (!this.clientIndustry.name || this.clientIndustry.name.length === 0) this.clientIndustry = {};
        console.log('this.contacts[0].phoneNumbers[0].number.length === 0',this.contacts[0].phoneNumbers[0].number.length);
        if (!this.contacts[0].phoneNumbers[0].number || this.contacts[0].phoneNumbers[0].number.length === 0) this.contacts[0].phoneNumbers = [];

    }

}