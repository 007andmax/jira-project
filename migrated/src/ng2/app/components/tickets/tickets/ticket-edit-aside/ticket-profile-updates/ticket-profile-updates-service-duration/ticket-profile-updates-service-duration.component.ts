import { DOCUMENT } from "@angular/common";
import { Component, HostListener, Inject, OnInit, ViewChild, Input, Output, EventEmitter } from "@angular/core";
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { IgxTimePickerComponent } from 'igniteui-angular';
@Component({
    selector: 'app-ticket-profile-updates-service-duration',
    templateUrl: './ticket-profile-updates-service-duration.component.html',
    styleUrls: ['./ticket-profile-updates-service-duration.component.scss']
})
export class TicketProfileUpdatesServiceDurationComponent implements OnInit {
    @ViewChild('picker') picker: IgxTimePickerComponent;
    @Output() onChange = new EventEmitter<any>();
    @Input() hour: number = 0;
    @Input() minute: number = 0;
    @Input() editMode: boolean = false;
    step = 1;

    constructor(@Inject(DOCUMENT) private document: Document,
        private companiesStateService: CompaniesStateService) {
    }
    public date: Date;

    public ngOnInit() {
        this.refresh();
        //  this.createThemeStyle();
        let serviceExpenseDurationPickerInterval = this.companiesStateService.getCurrentCompany().serviceExpenseDurationPickerInterval;
        if (serviceExpenseDurationPickerInterval === 'FIVE_MINUTES') this.step = 5;
        if (serviceExpenseDurationPickerInterval === 'TEN_MINUTES') this.step = 10;
        if (serviceExpenseDurationPickerInterval === 'FIFTEEN_MINUTES') this.step = 15;
    }
    show() {
        this.picker.openDialog();
    }
    public refresh() {
        // this.date = new Date();
        this.date = null;
        this.date.setHours(this.hour);
        this.date.setMinutes(this.minute);
    }
    onSelected() {
        let date = new Date(this.picker.value);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let quantity = hours + ((minutes) ? (minutes / 60) : 0);
        this.onChange.emit(quantity);
    }

}
