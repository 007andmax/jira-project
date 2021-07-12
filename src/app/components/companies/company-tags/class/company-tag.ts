import { Tag } from "src/app/interfaces/tag/tag";

export class CompanyTag implements Tag {
    defaultTag: string;
    id: string;
    usedCounter: number;
    word: string;
    companyId: string;
    isHover: boolean = false;
    constructor(data) {
        this.defaultTag = data.defaultTag;
        this.id = data.id;
        this.usedCounter = data.usedCounter;
        this.word = data.word;
        this.companyId = data.companyId;
    }

}