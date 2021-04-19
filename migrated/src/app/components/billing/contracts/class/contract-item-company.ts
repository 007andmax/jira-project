import { Tag } from 'src/app/interfaces/tag/tag';

export class ContractItemCompany {
    id: string;
    tags: Array<Tag> = [];
    default: boolean;
    name: string;
}