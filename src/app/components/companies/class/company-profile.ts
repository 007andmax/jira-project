import { WorkDay } from './work-day';
import { CompanyService } from './company-service';
import { CompanyProfileContact } from './company-profile-contact';
import { CompanyProfileAddress } from './company-profile-address';
import { Weeks } from '../../shared/interval/config/enums';
import { CompanyLogo } from './company-logo';
import { ImageCropper } from '../../shared/image-cropper/class/image-cropper';
import { Tag } from 'src/app/interfaces/tag/tag';
import { CompanyConditions } from './company-conditions';
import { CompanyAssociated } from './company-associated';
import { CompanyAssigned } from './company-assigned';
import { CompanyAndressContact } from 'src/app/interfaces/company/company-address-contact';
import { ThirdPartyApp } from './company-third-party-apps';

export class CompanyProfile {
    accountNumber: any;
    addresses: Array<CompanyProfileAddress>;
    agentLinkToEmail: any = null;
    clientIndustry: any = {};
    companyTicketStatistic?: any = {};
    clientType: string = '';
    contacts: Array<CompanyProfileContact>;
    defaultPaymentMethod: string = null;
    description: string;
    logo: CompanyLogo;
    domain: string = null;
    login: string = "";
    maxAgents: number = 0;
    name: string = "";
    password: string = "";
    conditions: CompanyConditions;
    paymentTerms: number;
    serviceType: string;
    removeOfflineTime: number = 30;
    services: Array<CompanyService>;
    workingDays: Array<WorkDay>;
    techLeadId: string;
    id: string;
    tags: Array<Tag> = [];
    associatedCompanies: Array<CompanyAssociated> = [];
    reputation?: number = 0;
    primaryContact: CompanyAndressContact;
    isUseSelectedUser: boolean = false;
    thirdPartyApps: Array<ThirdPartyApp> = []
    constructor() {
        this.logo = null;
        let contact: CompanyProfileContact = new CompanyProfileContact();
        let address: CompanyProfileAddress = new CompanyProfileAddress();
        address.shortVersion(contact);
        this.addresses = [address];
        this.contacts = [contact];
        this.workingDays = Weeks.map((item) => new WorkDay(item.toUpperCase(), 0, 0))
    }
    public setUseSelectedUser(data) {
        this.isUseSelectedUser = data;
    }
    public initShippingAdress() {
        let address: CompanyProfileAddress = new CompanyProfileAddress();
        address.fullVersion();
        address.sameAsShipping = false;
        address.isPrimary = false;
        this.addresses.push(address);
    }
    public setTags(data) {
        this.tags = data;
    }
    public onEditMode(company: CompanyProfile) {
        this.id = company.id;
        this.accountNumber = company.accountNumber;
        if (company.addresses.length == 1) {
            this.addresses = company.addresses.map(item => new CompanyProfileAddress(item));
            this.addresses[0].isPrimary = true;
        }
        if (company.addresses.length == 2) {
            this.addresses = [company.addresses.find(item => item.isPrimary), company.addresses.find(item => !item.isPrimary)].map(item => new CompanyProfileAddress(item));
        }
        if (this.addresses.length == 0) {
            let address: CompanyProfileAddress = new CompanyProfileAddress();
            address.fullVersion();
            this.addresses.push(address);
        }
        this.addresses[0].sameAsShipping = undefined;
        this.agentLinkToEmail = company.agentLinkToEmail;
        this.clientIndustry = company.clientIndustry;
        this.clientType = company.clientType;
        this.contacts = company.contacts.map(item => new CompanyProfileContact(item));
        this.defaultPaymentMethod = company.defaultPaymentMethod;
        this.description = company.description;
        this.logo = company.logo;
        this.domain = company.domain;
        this.login = company.login;
        this.maxAgents = company.maxAgents;
        this.name = company.name;
        this.password = company.password;
        this.defaultPaymentMethod = (company.defaultPaymentMethod) ? company.defaultPaymentMethod : null;
        this.paymentTerms = company.paymentTerms;
        this.serviceType = company.serviceType;
        this.removeOfflineTime = company.removeOfflineTime;
        this.services = company.services;
        this.workingDays = company.workingDays;
        this.techLeadId = company.techLeadId;
        if (this.addresses[0].phoneNumbers.length === 0) {
            this.addresses[0].phoneNumbers = [{
                number: '',
                typeNumber: 'OFFICE'
            }];
        } else {
            this.addresses[0].phoneNumbers.map((item) => {
                let number = item.number;
                if (number[0] === "1") number = `+1${number}`;
                item.number = number;
                return item;
            })
        }
        if (this.contacts[0].phoneNumbers.length === 0) {
            this.contacts[0].phoneNumbers = [{
                number: '',
                typeNumber: 'OFFICE'
            }];
        } else {
            this.contacts[0].phoneNumbers.map((item) => {
                let number = item.number;
                if (number[0] === "1") number = `+1${number}`;
                item.number = number;
                return item;
            })
        }
        if (!company.clientIndustry) {
            this.clientIndustry = {
                name: null
            }
        }
        this.tags = company.tags;
        this.reputation = company.reputation;
        if (company.companyTicketStatistic) this.companyTicketStatistic = company.companyTicketStatistic;
        this.associatedCompanies = company.associatedCompanies.map(item => new CompanyAssociated(item));
        this.thirdPartyApps = company.thirdPartyApps;
        if (this.thirdPartyApps.length === 0) {
            this.thirdPartyApps.push(new ThirdPartyApp({
                appId: '',
                appName: ''
            }));
        }
    }
    public getDataForUpdate() {
        let contacts = JSON.parse(JSON.stringify(this.contacts.map(item => (item.getDataForRequest(false, false)))));
        let addresses = [this.addresses[0]];
        if (this.addresses.length == 2 && this.addresses[1].checkForAdd()) addresses.push(this.addresses[1]);
        return {
            associatedCompanies: this.associatedCompanies,
            accountNumber: this.accountNumber,
            addresses: addresses,
            agentLinkToEmail: this.agentLinkToEmail,
            clientIndustry: (!this.clientIndustry.name || this.clientIndustry.name.length === 0) ? {} : { name: this.clientIndustry.name },
            clientType: this.clientType,
            contacts: contacts,
            defaultPaymentMethod: this.defaultPaymentMethod,
            description: this.description,
            logo: this.logo,
            domain: this.domain,
            login: this.login,
            maxAgents: this.maxAgents,
            name: this.name,
            password: this.password,
            paymentTerms: this.paymentTerms,
            serviceType: this.serviceType,
            removeOfflineTime: this.removeOfflineTime,
            services: this.services,
            workingDays: this.workingDays,
            techLeadId: this.techLeadId,
            id: this.id,
            tags: this.tags,
            reputation: this.reputation,
            thirdPartyApps: this.thirdPartyApps.filter(item => item.appId.length > 0 || item.appName.length > 0)
        }
    }
    public getDataForAdd() {
        let contacts = JSON.parse(JSON.stringify(this.contacts.map(item => (item.getDataForRequest(true, this.isUseSelectedUser)))));
        let addresses = [this.addresses[0]];
        if (this.addresses.length == 2 && this.addresses[1].checkForAdd()) addresses.push(this.addresses[1]);
        if (this.addresses.length == 1) {
            addresses.push(JSON.parse(JSON.stringify(this.addresses[0])));
            addresses[1].isPrimary = false;
        }
        return {
            associatedCompanies: this.associatedCompanies,
            accountNumber: this.accountNumber,
            addresses: addresses,
            agentLinkToEmail: this.agentLinkToEmail,
            clientIndustry: (!this.clientIndustry.name || this.clientIndustry.name.length === 0) ? {} : { name: this.clientIndustry.name },
            clientType: this.clientType,
            contacts: contacts,
            defaultPaymentMethod: this.defaultPaymentMethod,
            description: this.description,
            logo: this.logo,
            domain: this.domain,
            login: this.login,
            maxAgents: this.maxAgents,
            name: this.name,
            password: this.password,
            paymentTerms: this.paymentTerms,
            serviceType: this.serviceType,
            removeOfflineTime: this.removeOfflineTime,
            services: this.services,
            workingDays: this.workingDays,
            techLeadId: this.techLeadId,
            tags: this.tags,
            thirdPartyApps: this.thirdPartyApps.filter(item => item.appId.length > 0 || item.appName.length > 0)
        }

    }
    public editLogo(data) {
        this.logo = data;
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
        this.addresses[0].fullVersion();
        this.addresses[0].locationName = JSON.parse(JSON.stringify(this.name));
        this.initShippingAdress();
        this.agentLinkToEmail = null;
        this.clientIndustry = {
            name: null
        };
        this.description = null;
        this.login = '';
        this.defaultPaymentMethod = null;
        this.paymentTerms = null;
        this.serviceType = null;
        this.techLeadId = null;
        this.workingDays = Weeks.map((item) => new WorkDay(item.toUpperCase(), 0, 0));
        this.thirdPartyApps = [new ThirdPartyApp({
            appId: '',
            appName: ''
        })];
    }

    public onCheckFullVersion() {
        if (!this.clientIndustry.name || this.clientIndustry.name.length === 0) this.clientIndustry = {};
        if (!this.contacts[0].phoneNumbers[0].number || this.contacts[0].phoneNumbers[0].number.length === 0) this.contacts[0].phoneNumbers = [];
    }

    public getDataForDashboard() {
        let typeIndustry = typeof this.clientIndustry;
        let name = '';
        let type = typeof this.contacts[0].phoneNumbers[0];
        let data = {
            name: this.name == undefined ? '' : this.name,
            addresses: this.addresses,
            billingLocationName: this.addresses[0].locationName,
            shippingLocationName: this.addresses.length > 1 ? this.addresses[1].locationName : '',
            addresses_name: this.addresses.length > 0 ? this.addresses[0].address : '',
            shipping_addresses_name: this.addresses.length > 1 ? this.addresses[1].address : '',
            phoneNumber: this.addresses.length > 0 && this.addresses[0].phoneNumbers.length !== 0 ? this.addresses[0].phoneNumbers[0].number : '',
            totalTickets: this['companyTicketStatistic'].totalTickets,
            averageResponseTime: this['companyTicketStatistic'].averageResponseTime,
            tags: this.tags,
            serviceType: (this.serviceType == undefined || this.serviceType == null) ? '' : this.serviceType,
            domain: (this.domain == undefined || this.domain == null) ? '' : this.domain,
            clientIndustry: typeIndustry === 'object' ? name : this.clientIndustry,
            mapSrc: "https://maps.google.com/maps/embed/v1/place?key=AIzaSyAbP4DFpz4f9YcXMWUjdkOdyArX2peNt8s&q=" + this.addresses[0].locationLat + "," + this.addresses[0].locationLng + "",
            primaryContact: {
                firstName: this.contacts[0].firstName,
                lastName: this.contacts[0].lastName,
                email: this.contacts[0].primaryEmail,
                phoneNumber: type === 'object' ? this.contacts[0].phoneNumbers[0].number : this.contacts[0].phoneNumbers[0],
                avatar: this.contacts[0].avatar
            },
            clientType: this.clientType,
            description: this.description,
            reputation: this.reputation
        }
        if (typeIndustry === 'object' && this.clientIndustry !== null && this.clientIndustry.name !== null && this.clientIndustry.name !== '' && (this.name === '' || this.name === undefined || this.name === null)) {
            data.name = this.clientIndustry.name;
        }
        return data;
    }

}