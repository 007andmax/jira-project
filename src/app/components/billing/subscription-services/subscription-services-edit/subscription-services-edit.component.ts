import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubscriptionServices } from '../class/subscription-services';
import { Subscription } from 'rxjs';
import { SubscriptionServicesService } from 'src/app/services/subscription-services/subscription-services.service';
import { TaxesStateService } from 'src/app/states/taxes/taxes-state.service';
import { SubscriptionServicesStateService } from 'src/app/states/subscription-services/subscription-services-state.service';
import { Tax } from 'src/class/taxes/tax';

@Component({
  selector: 'app-subscription-services-edit',
  templateUrl: './subscription-services-edit.component.html',
  styleUrls: ['./subscription-services-edit.component.scss']
})
export class SubscriptionServicesEditComponent implements OnInit, OnDestroy {
  open: boolean = false;
  modelForm: FormGroup;
  submitted: boolean = false;
  service: SubscriptionServices;
  selectedTaxes: Array<Tax> = [];
  sub: Subscription = new Subscription();
  @Output() onClose = new EventEmitter<any>();
  constructor(
    private subscriptionServicesService: SubscriptionServicesService,
    private taxesStateService: TaxesStateService,
    private subscriptionServicesStateService: SubscriptionServicesStateService,
    public cd: ChangeDetectorRef,
    public formBuilder: FormBuilder,) { }

  ngOnInit() {
    let getShowAsideForEdit = this.subscriptionServicesStateService.showAsideForEdit.subscribe(data => {
      this.service = data;
      this.modelForm.patchValue({ name: this.service.name, rate: this.service.rate, taxIds: this.service.taxIds, updateServicePricesInContracts: this.service.updateServicePricesInContracts })
      if (this.taxesStateService.getTaxes().length > 0) this.selectedTaxes = this.taxesStateService.getTaxes().filter(item => this.service.taxIds.some(tax => tax == item.id));
      this.open = true;
    })
    this.sub.add(getShowAsideForEdit);
    this.modelForm = this.formBuilder.group({
      name: [
        "",
        [Validators.required, Validators.minLength(1), Validators.maxLength(100)]
      ],
      rate: [0,
        [Validators.required]
      ],
      taxIds: [
        []
      ],
      updateServicePricesInContracts: [false]
    })
  }

  onTaxesChange(data) {
    this.selectedTaxes = data;
    this.modelForm.controls["taxIds"].setValue(data.map(item => item.id))
  }


  save() {
    if (this.modelForm.invalid) {
      console.log("this.modelForm", this.modelForm);
      return;
    }
    this.subscriptionServicesService.editService(this.service.id, this.modelForm.value).subscribe(data => {
      this.close();
    })
  }
  close() {
    this.open = false;
    this.modelForm.reset();
    this.onClose.emit(null);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
