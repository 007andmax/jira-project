import { Tag } from "./tag";

export interface Company {
    id: string;
    tags: Array<Tag>;
    default: boolean;
}