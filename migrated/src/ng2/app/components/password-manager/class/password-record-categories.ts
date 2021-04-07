import { PASSWORD_RECORD_TYPES } from "src/ng2/app/const/password-record-types";

export class PasswordRecordCategories {
    id: string;
    name: string;
    title: string;
    default: boolean;
    constructor(data) {
        let list = PASSWORD_RECORD_TYPES;
        let findDefault = list.find(item => item.UPPERCASE === data.name);
        this.id = data.id;
        this.name = data.name;
        this.default = data.default;
        this.title = (findDefault) ? findDefault.TITLE : this.name;
    }
}