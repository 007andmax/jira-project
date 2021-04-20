import { DOCUMENT } from "@angular/common";
import { Component, HostListener, Inject, OnInit, ViewChild, Input, Output, EventEmitter } from "@angular/core";
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { IgxTimePickerComponent, InteractionMode } from 'igniteui-angular';
var $ = require("jquery");
@Component({
    selector: 'app-ticket-profile-updates-service-duration',
    templateUrl: './ticket-profile-updates-service-duration.component.html',
    styleUrls: ['./ticket-profile-updates-service-duration.component.scss']
})
export class TicketProfileUpdatesServiceDurationComponent implements OnInit {
    public mode = InteractionMode.DropDown;
    @ViewChild('picker') picker: IgxTimePickerComponent;
    @Output() onChange = new EventEmitter<any>();
    @Input() hour: number = 0;
    @Input() minute: number = 0;
    @Input() editMode: boolean = false;
    @Input() validate: boolean = true;
    @Input() errorMessage: string = "";
    step = 1;

    constructor(@Inject(DOCUMENT) private document: Document,
        private companiesStateService: CompaniesStateService) {
    }
    public date: Date;

    public ngOnInit() {
        this.refresh();
        let serviceExpenseDurationPickerInterval = this.companiesStateService.getCurrentCompany().serviceExpenseDurationPickerInterval;
        if (serviceExpenseDurationPickerInterval === 'FIVE_MINUTES') this.step = 5;
        if (serviceExpenseDurationPickerInterval === 'TEN_MINUTES') this.step = 10;
        if (serviceExpenseDurationPickerInterval === 'FIFTEEN_MINUTES') this.step = 15;
    }
    show() {
        this.picker.openDialog();
    }
    public refresh() {
        this.date = new Date();
        this.date.setHours(this.hour);
        this.date.setMinutes(this.minute);
        this.date.setSeconds(0);
        this.date.setMilliseconds(0);
    }
    onSelected() {
        this.date = new Date(this.picker.value);
        let hours = this.date.getHours();
        let minutes = this.date.getMinutes();
        let quantity = hours + ((minutes) ? (minutes / 60) : 0);
        this.onChange.emit(quantity);
    }
    onClosed() {
        this.picker.value = this.date;
    }
    public onOpened(data) {
        let topInput = $(data.input.nativeElement).offset().top;
        let height = $(data.container.nativeElement).parent().height();
        $(data.container.nativeElement).parent().offset({ top: topInput - height - 15 });
        $(data.container.nativeElement).parent().css({ "opacity": 1 });
    }
}
