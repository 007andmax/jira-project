import { FORMAT_DATE_1 } from 'src/ng2/app/const/date-picker';
import * as moment from "moment";
export class RecurringTicketsEditAsideDate {
    title: string;
    constructor() { }
    public setTitle(model, formatDate) {
        let date = new Date(model.year, model.month - 1, model.day);
        this.title = moment(date).format(formatDate);
    }
    public getTitle() {
        return this.title;
    }
    public clearTitle() {
        this.title = '';
    }
}