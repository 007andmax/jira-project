import { MatChipComponent } from './';
import { MatChipListComponent } from './';
import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { UserDefaultSubscriptionComponent } from '../../../users-aside/user-default-subscription/user-default-subscription.component';
import { MatFormFieldComponent } from 'src/app/components/shared/mat-form-field/mat-form-field.component';

@Component({
  standalone: true,
  imports: [MatChipComponent, MatChipListComponent, CommonModule],
    selector: 'app-users-filter-default-subscription',
    templateUrl: './users-filter-default-subscription.component.html',
    styleUrls: ['./users-filter-default-subscription.component.scss'],
    standalone: true
})
export class UsersFilterDefaultSubscriptionComponent extends UserDefaultSubscriptionComponent {

  @ViewChild('formField', { static: true }) formField: MatFormFieldComponent;
  selected(field) {
    let subscription = JSON.parse(JSON.stringify(this.defaultSubscriptions));
    subscription[field].enabled = !subscription[field].enabled;
    subscription[field].isExist = false;
    subscription[field].activated = true;
    this.onChange.emit(subscription);
    if (subscription.invoiceSubscription.enabled || subscription.ticketSubscription.enabled || subscription.ticketManagerSubscription.enabled) this.formField.checkSelectedItems([true]);
    if (!subscription.invoiceSubscription.enabled && !subscription.ticketSubscription.enabled && !subscription.ticketManagerSubscription.enabled) this.formField.checkSelectedItems([]);
  }
  clearWithOutChanges() {
    this.formField.checkSelectedItems([]);
  }
}
