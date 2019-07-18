export class RecurringTicketsEditAsideDate {
    title:string;
    constructor (){}
    public setTitle (model) {

        this.title = `${model.month}/${model.day}/${model.year}`;
    }
    public getTitle ( ) {
        return this.title;
    }
    public clearTitle () {
        this.title = '';
    }
}