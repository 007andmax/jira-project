import { DOCUMENT } from "@angular/common";
import { Component, HostListener, Inject, OnInit, ViewChild, Input } from "@angular/core";
import { CompaniesStateService } from 'src/ng2/app/states/company/companies-state.service';
import { IgxTimePickerComponent } from 'igniteui-angular';
@Component({
    selector: 'app-ticket-profile-updates-service-duration',
    templateUrl: './ticket-profile-updates-service-duration.component.html',
    styleUrls: ['./ticket-profile-updates-service-duration.component.scss']
})
export class TicketProfileUpdatesServiceDurationComponent implements OnInit {
    @Input() hour: number = 0;
    @Input() minute: number = 0;
    public title = "Samples";
    private isIE = !((window as any).ActiveXObject) && "ActiveXObject" in window;
    private theme = "default-theme";
    private styleElem: HTMLStyleElement;
    private typefacesLoaded = ["Titillium Web", "Roboto"];
    private typefaceUrl = "https://fonts.googleapis.com/css?family=";
    step = 1;
    @ViewChild('picker') picker: IgxTimePickerComponent;
    constructor(@Inject(DOCUMENT) private document: Document,
        private companiesStateService: CompaniesStateService) {
       
    }
    public date: Date;

    public ngOnInit() {
        console.log("this.hour",this.hour)
        console.log("this.minute",this.minute)
        this.date = new Date();
        this.date.setHours(this.hour);
        this.date.setMinutes(this.minute);
        this.createThemeStyle();
        let serviceExpenseDurationPickerInterval = this.companiesStateService.getCurrentCompany().serviceExpenseDurationPickerInterval;
        if (serviceExpenseDurationPickerInterval === 'FIVE_MINUTES') this.step = 5;
        if (serviceExpenseDurationPickerInterval === 'TEN_MINUTES') this.step = 10;
        if (serviceExpenseDurationPickerInterval === 'FIFTEEN_MINUTES') this.step = 15;
        console.log("this.picker", this.picker);

    }
    show() {

        this.picker.openDialog();
    }

    @HostListener("window:message", ["$event"])
    private onMessage(e: MessageEvent) {
        if (e.origin === e.data.origin && typeof e.data.themeStyle === "string") {
            this.styleElem.textContent = e.data.themeStyle;
            const typeface = window.getComputedStyle(this.document.body).fontFamily.replace(/\"/g, "");
            if (!(typeface.match(/,/g) || []).length &&
                !this.typefacesLoaded.includes(typeface)) {
                this.typefacesLoaded.push(typeface);
                this.createTypefaceLink(typeface);
            }
        } else if (e.origin === e.data.origin && typeof e.data.theme === "string") {
            this.document.body.classList.remove(this.theme);
            this.document.body.classList.add(e.data.theme);
            this.theme = e.data.theme;
        }
    }

    private createTypefaceLink(typeface: string) {
        const typefaceElem = this.document.createElement("link");
        typefaceElem.rel = "stylesheet";
        typefaceElem.id = "ignteui-theme-typeface";
        typefaceElem.href = this.typefaceUrl + typeface.split(" ").join("+");
        document.head.insertBefore(typefaceElem, this.document.head.lastElementChild);
    }

    private createThemeStyle() {
        if (this.isIE) {
            this.document.body.classList.add(this.theme);
        } else {
            this.styleElem = document.createElement("style");
            this.styleElem.id = "igniteui-theme";
            document.head.insertBefore(this.styleElem, this.document.head.lastElementChild);
            this.document.body.classList.add("custom-body");
        }
    }
}
