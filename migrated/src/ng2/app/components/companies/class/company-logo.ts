import { CompanyLogoCropped } from './company-logo-cropped';

export class CompanyLogo {
    cropped:CompanyLogoCropped;
    base64: string;
    h: number;
    origin: any;
    w: number;
    x: number;
    y: number;
    updatedAt:number;
   
    constructor() {
        this.origin = { id: '' };
    }
}