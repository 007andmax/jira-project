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
import { CompanyLogoCropped } from './company-logo-cropped';
import { CompanyConditions } from './company-conditions';

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
    conditions:CompanyConditions;
    paymentTerms: number;
    serviceType: string;
    removeOfflineTime: number = 30;
    services: Array<CompanyService>;
    workingDays: Array<WorkDay>;
    techLeadId: string;
    id: string;
    tags: Array<Tag>;
    reputation?: number = 0;
    constructor() {
        this.logo = null;
        let contact: CompanyProfileContact = new CompanyProfileContact();
        let address: CompanyProfileAddress = new CompanyProfileAddress();
        address.shortVersion(contact);
        this.addresses = [address];
        this.contacts = [contact];
        this.workingDays = Weeks.map((item) => new WorkDay(item.toUpperCase(), 0, 0))
    }
    public setTags(data) {
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
        }
        if (this.contacts[0].phoneNumbers.length === 0) {
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
        this.tags = company.tags;
        this.reputation = company.reputation;
        this.companyTicketStatistic = company.companyTicketStatistic;

    }
    public getDataForUpdate() {

     //this.onCheckFullVersion();
        return {
            accountNumber: this.accountNumber,
            addresses: this.addresses,
            agentLinkToEmail: this.agentLinkToEmail,
            clientIndustry: (!this.clientIndustry.name || this.clientIndustry.name.length === 0) ? {}  : this.clientIndustry,
            clientType: this.clientType,
            contacts: this.contacts.map((item,index) => {
                if (index === 0 && (!item.phoneNumbers[0].number || item.phoneNumbers[0].number.length === 0)) item.phoneNumbers = [];
                return item;
            }),
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
        }
    }
    public editLogo(data) {
        this.logo = data;
        /*    this.logo.cropped = new CompanyLogoCropped();
            
            this.logo.base64 = data.croppedImage.base64;
            this.logo.w = data.croppedImage.width;
            this.logo.h = data.croppedImage.width;
            this.logo.x = data.croppedImage.imagePosition.x1;
            this.logo.y = data.croppedImage.imagePosition.y1;*/
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
        // let contact: CompanyProfileContact = new CompanyProfileContact();
        this.contacts[0].fullVersion();
        //   let address: CompanyProfileAddress = new CompanyProfileAddress();
        this.addresses[0].fullVersion();
        this.agentLinkToEmail = null;
        this.clientIndustry = {
            name: null
        };
        //  this.clientType = '';
        this.description = null;
        //  this.domain = null;
        this.login = '';

        this.defaultPaymentMethod = null;
        this.paymentTerms = null;
        this.serviceType = null;
        this.techLeadId = null;
        //  this.addresses = [address];
        //  this.contacts = [contact];
        this.workingDays = Weeks.map((item) => new WorkDay(item.toUpperCase(), 0, 0))

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
            addresses_name: this.addresses.length > 0 ? this.addresses[0].address : '',
            phoneNumber: this.addresses.length > 0 && this.addresses[0].phoneNumbers.length !== 0 ? this.addresses[0].phoneNumbers[0].number : '',
            totalTickets: this['companyTicketStatistic'].totalTickets,
            averageResponseTime: this['companyTicketStatistic'].averageResponseTime,
            tags: this.tags,
            serviceType: (this.serviceType == undefined || this.serviceType == null) ? '' : this.serviceType,
            domain: (this.domain == undefined || this.domain == null) ? '' : this.domain,
            clientIndustry: typeIndustry === 'object' ? name : this.clientIndustry,
            mapSrc: "https://maps.google.com/maps/embed/v1/place?key=AIzaSyAbP4DFpz4f9YcXMWUjdkOdyArX2peNt8s&q="+this.addresses[0].locationLat +","+this.addresses[0].locationLng+"",
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