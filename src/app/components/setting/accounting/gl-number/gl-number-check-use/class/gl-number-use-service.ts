import { VersionedId } from "src/app/interfaces/versioned-id";

export class GlNumberUseService {
    versionedId: VersionedId;
    name: string;
    constructor(data) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }

        }
    }
}