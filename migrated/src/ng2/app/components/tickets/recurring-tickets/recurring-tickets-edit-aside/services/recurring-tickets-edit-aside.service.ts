export class RecurringTicketsEditAsideService {
    constructor () {}
    public parseDatePickerModel (model):string {

        return `${model.year}-${model.month}-${model.day}`;
    }
}