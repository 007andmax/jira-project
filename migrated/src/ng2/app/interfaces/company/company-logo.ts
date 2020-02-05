import { CompanyLogoCropped } from './company-logo-cropped';
import { CompanyLogoOrigin } from './company-logo-origin';

export interface CompanyLogo {
    base64: null;
    cropped: CompanyLogoCropped;
    h: number;
    id: string;
    origin: CompanyLogoOrigin;
    updatedAt: number;
    w: number;
    x: number;
    y: number;
}