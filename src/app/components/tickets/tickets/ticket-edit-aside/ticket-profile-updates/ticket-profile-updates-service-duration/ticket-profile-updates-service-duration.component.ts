import { DOCUMENT, NgClass, NgFor } from "@angular/common";
import { Component, Inject, OnInit, Input, Output, EventEmitter, ElementRef } from "@angular/core";
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { ServiceDurationValue } from "./class/service-duration-value";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-ticket-profile-updates-service-duration',
    templateUrl: './ticket-profile-updates-service-duration.component.html',
    styleUrls: ['./ticket-profile-updates-service-duration.component.scss'],
    standalone: true,
    imports: [NgbDropdownModule, NgClass, NgFor]
})
export class TicketProfileUpdatesServiceDurationComponent implements OnInit {
    @Output() onChange = new EventEmitter<any>();
    @Input() hour: number = 0;
    @Input() minute: number = 0;
    @Input() validate: boolean = true;
    @Input() errorMessage: string = "";
    @Input() isDisabled: boolean = false;
    step = 1;
    hours: Array<ServiceDurationValue> = [];
    minutes: Array<ServiceDurationValue> = [];
    constructor(@Inject(DOCUMENT) private document: Document,
        private elRef: ElementRef,
        private companiesStateService: CompaniesStateService) {
    }
    public date: Date;
    onWheelHours(event) {
        event.preventDefault();
        let value = this.hours.find(item => item.selected).value;
        if (event.deltaY > 0) {
            if ((value + 1) == 24) {
                value = 0;
            } else {
                value++;
            }
        } else {
            if ((value - 1) == -1) {
                value = 23;
            } else {
                value--;
            }
        }
        this.setDisplayHours(value);
    }
    onWheelMinutes(event) {
        event.preventDefault();
        let value = this.minutes.find(item => item.selected).value;
        if (event.deltaY > 0) {
            if ((value + 1 * this.step) > 59) {
                value = 0;
            } else {
                value += 1 * this.step;
            }
        } else {
            if ((value - 1 * this.step) < 0) {
                value = this.getLastValueForMinutes();
            } else {
                value -= 1 * this.step;
            }
        }
        this.setDisplayMinutes(value);
    }
    getLastValueForMinutes() {
        if (this.step == 1) return 59;
        if (this.step == 5) return 55;
        if (this.step == 10) return 50;
        if (this.step == 15) return 45;
    }
    public ngOnInit() {
        this.setDisplayHours(0);
        let serviceExpenseDurationPickerInterval = this.companiesStateService.getCurrentCompany().serviceExpenseDurationPickerInterval;
        if (serviceExpenseDurationPickerInterval === 'FIVE_MINUTES') this.step = 5;
        if (serviceExpenseDurationPickerInterval === 'TEN_MINUTES') this.step = 10;
        if (serviceExpenseDurationPickerInterval === 'FIFTEEN_MINUTES') this.step = 15;
        this.setDisplayMinutes(0);
        this.refresh();
    }
    setDisplayHours(value) {
        this.hours = [];
        let val = value;
        for (let i = 3; i >= 1; i--) {
            if ((val - i) < 0) {
                this.hours.push(new ServiceDurationValue(24 + (val - i)));
            } else {
                this.hours.push(new ServiceDurationValue(val - i));
            }
        }
        this.hours.push(new ServiceDurationValue(val, true));
        for (let i = 1; i <= 3; i++) {
            if ((val + i) > 23) {
                this.hours.push(new ServiceDurationValue((val + i) - 24));
            } else {
                this.hours.push(new ServiceDurationValue(val + i));
            }
        }
    }
    setDisplayMinutes(value) {
        this.minutes = [];
        let val = value;
        for (let i = 3; i >= 1; i--) {
            if ((val - i * this.step) < 0) {
                this.minutes.push(new ServiceDurationValue(60 + (val - i * this.step)));
            } else {
                this.minutes.push(new ServiceDurationValue(val - i * this.step));
            }
        }
        this.minutes.push(new ServiceDurationValue(val, true));
        for (let i = 1; i <= 3; i++) {
            if ((val + i * this.step) > 59) {
                this.minutes.push(new ServiceDurationValue((val + i * this.step) - 60));
            } else {
                this.minutes.push(new ServiceDurationValue(val + i * this.step));
            }
        }
    }
    getParseValue(i) {
        return (i >= 10) ? i : `0${i}`;
    }
    getParseDate() {
        return `${(this.date.getHours() < 10) ? "0" + this.date.getHours() : this.date.getHours()}:${(this.date.getMinutes() < 10) ? "0" + this.date.getMinutes() : this.date.getMinutes()}`
    }
    setNextMinutes() {
        let index = this.minutes.findIndex(item => item.selected);
        if (this.minutes[index].value + this.step > 59) {
            this.setDisplayMinutes(0);
        } else {
            this.setDisplayMinutes(this.minutes[index].value + this.step);
        }
    }
    setNextHour() {
        let index = this.hours.findIndex(item => item.selected);
        if (this.hours[index].value + 1 > 23) {
            this.setDisplayHours(0);
        } else {
            this.setDisplayHours(this.hours[index].value + 1);
        }
    }
    setPreviewHour() {
        let index = this.hours.findIndex(item => item.selected);
        if (this.hours[index].value - 1 < 0) {
            this.setDisplayHours(23);
        } else {
            this.setDisplayHours(this.hours[index].value - 1);
        }
    }
    setPreviewMinutes() {
        let index = this.minutes.findIndex(item => item.selected);
        if (this.minutes[index].value - this.step < 0) {
            this.setDisplayMinutes(this.getLastValueForMinutes());
        } else {
            this.setDisplayMinutes(this.minutes[index].value - this.step);
        }
    }
    setHours(i) {
        this.hours.forEach(item => item.selected = false);
        this.hours[i].setSelected(true);
    }
    setMinutes(i) {
        this.minutes.forEach(item => item.selected = false);
        this.minutes[i].setSelected(true);
    }
    public reset() {
        this.date = new Date();
        this.date.setHours(0);
        this.date.setMinutes(0);
        this.date.setSeconds(0);
        this.date.setMilliseconds(0);
        this.setDisplayHours(0);
        this.setDisplayMinutes(0);
    }
    public refresh() {
        this.date = new Date();
        this.date.setHours(this.hour);
        this.date.setMinutes(this.minute);
        this.date.setSeconds(0);
        this.date.setMilliseconds(0);
        this.setDisplayHours(this.hour);
        this.setDisplayMinutes(this.minute);
    }
    onSelected() {
        this.date.setHours(this.hours.find(item => item.selected).value);
        this.date.setMinutes(this.minutes.find(item => item.selected).value);
        let hours = this.date.getHours();
        let minutes = this.date.getMinutes();
        let quantity = hours + ((minutes) ? (minutes / 60) : 0);
        this.onChange.emit(quantity);
    }
    public trackByIndex(index, item) {
        return index;
    }
}
