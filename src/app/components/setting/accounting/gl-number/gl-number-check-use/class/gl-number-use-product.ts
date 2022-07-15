import { VersionedId } from "src/app/interfaces/versioned-id";

export class GlNumberUseProduct {
    versionedId: VersionedId;
    cost: number;
    sale: number;
    description: string;
    constructor(data) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }

        }
    }
}