export class UserCount {
    "all": number = 0;
    "customer": number = 0;
    "archived": number = 0;
    "lead": number = 0;
    constructor(data = null) {
        if (data) {
            for (const key in data) {
                this[key] = data[key];
            }
        }
    }
}