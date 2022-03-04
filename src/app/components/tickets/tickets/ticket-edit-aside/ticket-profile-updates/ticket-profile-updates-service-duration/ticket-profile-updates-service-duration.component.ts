import { DOCUMENT } from "@angular/common";
import { Component, HostListener, Inject, OnInit, ViewChild, Input, Output, EventEmitter, ElementRef } from "@angular/core";
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { IgxTimePickerComponent, InteractionMode } from 'igniteui-angular';
import { ServiceDurationValue } from "./class/service-duration-value";
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
    hours: Array<ServiceDurationValue> = [];
    minutes: Array<ServiceDurationValue> = [];
    constructor(@Inject(DOCUMENT) private document: Document,
        private elRef: ElementRef,
        private companiesStateService: CompaniesStateService) {
    }
    public date: Date;

    onContainerScroll(event) {

        event.stopPropagation();
        event.preventDefault();
        console.log(event.target.scrollTop);

    }
    onWheelHours(event) {
        event.preventDefault();
        console.log("event", event);
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
        console.log("event", event);
        let value = this.minutes.find(item => item.selected).value;
        if (event.deltaY > 0) {
            if ((value + 1 * this.step) > 59) {
                value = 0;
            } else {
                value += 1 * this.step;
            }


        } else {
            if ((value - 1 * this.step) < 0) {
                if (this.step == 1) value = 59;
                if (this.step == 5) value = 55;
                if (this.step == 10) value = 50;
                if (this.step == 15) value = 45;

            } else {
                value -= 1 * this.step;
            }
        }
        console.log("value", value);
        this.setDisplayMinutes(value);
        /* scale += event.deltaY * -0.01;
 
         // Restrict scale
         scale = Math.min(Math.max(.125, scale), 4);
 
         // Apply scale transform
         el.style.transform = `scale(${scale})`;*/
    }
    public ngOnInit() {

        this.setDisplayHours(0);

        // for (let i = 0; i <= 23; i++) this.hours.push(new ServiceDurationValue(i));
        var lastScrollTop = 0;
        window.addEventListener("scroll", function (event) { // or window.addEventListener("scroll"....
            var element = event.target;
            console.log("element", element);
            var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
            if (st > lastScrollTop) {
                // downscroll code
                console.log("down");
            } else {
                // upscroll code
                console.log("up");
            }
            lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
        }, false);

        let serviceExpenseDurationPickerInterval = this.companiesStateService.getCurrentCompany().serviceExpenseDurationPickerInterval;
        if (serviceExpenseDurationPickerInterval === 'FIVE_MINUTES') this.step = 5;
        if (serviceExpenseDurationPickerInterval === 'TEN_MINUTES') this.step = 10;
        if (serviceExpenseDurationPickerInterval === 'FIFTEEN_MINUTES') this.step = 15;
        this.refresh();
        this.setDisplayMinutes(0);
        /* for (let i = 0; i < 60;) {
             this.minutes.push(new ServiceDurationValue(i));
             i += this.step
         }
         console.log("this.minutes", this.minutes);*/
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
        console.log("this.hours", this.hours);
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
        console.log("this.minutes", this.minutes);
    }
    getParseValue(i) {
        return (i >= 10) ? i : `0${i}`;
    }
    show() {
        this.picker.openDialog();
    }
    getParseDate() {
        return `${(this.date.getHours() < 10) ? "0" + this.date.getHours() : this.date.getHours()}:${(this.date.getMinutes() < 10) ? "0" + this.date.getMinutes() : this.date.getMinutes()}`
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
    }
    public refresh() {
        this.date = new Date();
        this.date.setHours(this.hour);
        this.date.setMinutes(this.minute);
        this.date.setSeconds(0);
        this.date.setMilliseconds(0);
    }
    onSelected() {
        // this.date = new Date(this.picker.value);
        this.date.setHours(this.hours.find(item => item.selected).value);
        this.date.setMinutes(this.minutes.find(item => item.selected).value);
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
    public trackByIndex(index, item) {
        return index;
    }
}
