export class CompanyEditLogo {
    base64: string;
    h: number;
    id: string;
    origin: { id: string };
    w: number;
    x: number;
    y: number;
    constructor(base64, h, id, origin, w, x, y) {
        this.base64 = base64;
        this.h = h;
        this.id = id;
        this.origin = { id: origin };
        this.w = w;
        this.x = x;
        this.y = y;
    }
}