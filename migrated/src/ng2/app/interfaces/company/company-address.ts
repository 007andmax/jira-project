import { CompanyAddressPhome } from './company-address-phone';
import { CompanyAndressType } from './company-address-type';

export interface CompanyAndress {
    address: string;
    addressWithSuitNumberAndPostalCode: string;
    company: CompanyAndressType;
    country: string;
    countryCode: string;
    id: string;
    isPrimary: boolean;
    locationLat: number;
    locationLng: number;
    longCity: string;
    longState: string;
    phoneNumbers: Array<CompanyAddressPhome>;
    postalCode: string;
    shortCity: string;
    shortState: string;
    suiteNumber: string;
}