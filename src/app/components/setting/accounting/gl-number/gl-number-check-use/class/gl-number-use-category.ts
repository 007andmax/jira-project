import { GlNumber } from "src/class/gl-number/gl-number";

export class GlNumberUseCategory {

    id: string;
    name: string;
    glNumber: GlNumber;
    constructor(data) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }

        }
    }
}