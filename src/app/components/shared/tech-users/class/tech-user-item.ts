import { User } from '../../../users/class/user';

export class TechUserItem extends User {

    selected: boolean = false;
    indexNoAvatar: number = 0;
    constructor(data = null) {
        super(data);
        this.setIndexNoAvatar(this.randomInteger(0, 6));
    }
    public setIndexNoAvatar(data) {
        this.indexNoAvatar = data;
    }
    randomInteger(min, max) {
        // случайное число от min до (max+1)
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }
}