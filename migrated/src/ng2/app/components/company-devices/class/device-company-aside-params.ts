export class DeviceCompanyAsideParams {
    type: string;
    ids: Array<string>;
    constructor(type, ids) {
        this.type = type;
        this.ids = ids;
    }
}