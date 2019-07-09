export class RecurringTicketsEditAsideService {
    constructor() { }

    public updateMonthAndYearDatePicker(datepicker, navDate) {
        datepicker.month = navDate.next.month;
        datepicker.year = navDate.next.year;
    }
}