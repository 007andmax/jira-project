import { Tag } from 'src/ng2/app/interfaces/tag/tag';

export class ContractItemCompany {
    id: string;
    tags: Array<Tag> = [];
    default: boolean;
    name:string;
}