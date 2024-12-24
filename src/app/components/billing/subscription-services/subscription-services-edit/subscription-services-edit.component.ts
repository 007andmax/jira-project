import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-subscription-services-edit',
  templateUrl: './subscription-services-edit.component.html',
  styleUrls: ['./subscription-services-edit.component.scss']
})
export class SubscriptionServicesEditComponent implements OnInit, OnDestroy {
  open: boolean = false;
  glNumbers: Array<GlNumber> = [];
  validate: NonContractServiceValidate = new NonContractServiceValidate();
  service: NonContractServices;
  sub: Subscription = new Subscription();
  @ViewChild('glNumberSelect', { static: false }) glNumberSelect: DropDownComponent;
  @Output() onClose = new EventEmitter<any>();
  constructor(private glNumberStateService: GlNumberStateService,
    private glNumberService: GlNumberService,
    private nonContractServicesStateService: NonContractServicesStateService,
    private nonContractServicesService: NonContractServicesService) { }

  ngOnInit() {
    let getShowAsideForEdit = this.nonContractServicesStateService.getShowAsideForEdit().subscribe(data => {
      this.service = data;
      this.open = true;
    })
    this.sub.add(getShowAsideForEdit);
    if (this.glNumberStateService.getGLNumbers().length > 0) this.glNumbers = this.sortGlNumbers(this.glNumberStateService.getGLNumbers());
    let getOnGlNumbers = this.glNumberStateService.getOnGlNumbers().subscribe((data) => {
      this.glNumbers = this.sortGlNumbers(data);
    })
    this.sub.add(getOnGlNumbers);

  }
  private sortGlNumbers(data) {
    return data.sort((a, b) => (a.glNumber.toLowerCase() > b.glNumber.toLowerCase()) ?
      1 : ((b.glNumber.toLowerCase() > a.glNumber.toLowerCase()) ? -1 : 0));
  }
  onChangeName() {
    if (this.service.name.length > 3 && this.service.name.length < 100) this.validate.resetName();
  }
  onChangeRate(event) {
    this.service.rate = Number(event.target.value);
    this.service.rate_str = Number(event.target.value).toFixed(2);
    if (this.service.rate >= 0) this.validate.resetRate();
  }
  onTaxesChange(data) {
    this.service.taxes = data;
  }
  onAddGlNumber(data) {
    this.glNumberService.addGlNumber(data, "").subscribe((res: any) => {
      this.service.glNumber = res;
    })
  }
  glDropDownItemName(item) {
    return `${item["glNumber"]} - ${(item["description"] && item["description"].length > 0) ? item["description"]
      : "No description"}`;
  }
  save() {
    if (!this.validate.isValidate(this.service)) return;
    this.nonContractServicesService.changeService(this.service.getDataForUpdate()).subscribe(data => {
      this.glNumberStateService.refreshGlNumbersCheck();
      this.close();
    })
  }
  onSelectGlNumbers(data) {
    this.service.glNumber = data;
  }
  close() {
    this.open = false;
    this.onClose.emit(null);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
