import { FilterListTop } from 'src/ng2/class/list/filter-list-top';

export class UserFilter {
    filterTop: Array<FilterListTop> = [new FilterListTop('name', 'ASC'),
    new FilterListTop('address', ''),
    new FilterListTop('primary_contact', ''),
    new FilterListTop('email', ''),
    new FilterListTop('tickets', ''),
    new FilterListTop('devices', ''),
    new FilterListTop('users', '')];
}