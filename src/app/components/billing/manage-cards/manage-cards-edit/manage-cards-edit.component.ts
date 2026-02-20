import { Component } from '@angular/core';
import { ManageCardsAddComponent } from '../manage-cards-add/manage-cards-add.component';
import { Validators } from '@angular/forms';
import { Card } from '../class/card';
import { TitleListType } from 'src/app/components/tickets/tickets/tickets-header/class/title-list-type';

@Component({
  selector: 'app-manage-cards-edit',
  templateUrl: './manage-cards-edit.component.html',
  styleUrls: ['./manage-cards-edit.component.scss']
})
export class ManageCardsEditComponent extends ManageCardsAddComponent {
  maskedCardNumber: string
  ngOnInit() {
    for (let i = 1; i <= 12; i++) {
      this.months.push(new TitleListType(`${i < 10 ? '0' + i : i}`, `${i < 10 ? '0' + i : i}`));
    }
    for (let i = new Date().getFullYear() - 1; i <= new Date().getFullYear() + 20; i++) {
      this.years.push(new TitleListType(`${i}`, `${i}`.substring(2, 4)));
    }
    let getShowAsideForAdd = this.manageCardsStateService.showAsideForEdit.subscribe(data => {
      this.manageCardsService.getCard(data.id).subscribe((res: any) => {
        this.maskedCardNumber = res.maskedCardNumber;
        this.modelForm.patchValue({
          id: res.id,
          cardType: res.cardType,
          cardholderName: res.cardholderName,
          expiryDate: res.expiryDate,
          streetnumber: res.streetnumber,
          streetname: res.streetname,
          zipcode: res.zipcode,
          address: res.address,
          city: res.city,
          state: res.state,
          country: res.country,
          companyId: res.companyId,
        });
        console.log("res.expiryDate.substring(0, 2)", res.expiryDate.substring(0, 2));
        console.log("res.expiryDate.substring(2, 4)", res.expiryDate.substring(2, 4));
        this.selectedMonth = this.months.find(month => month.type == res.expiryDate.substring(2, 4));
        this.selectedYear = this.years.find(year => year.type == res.expiryDate.substring(0, 2));
        this.selectedCompany = this.companiesStateService.allCompanies.find(company => company.id === res.companyId);
        this.showAdd = true;
        this.cd.detectChanges();
      });
    });
    this.sub.add(getShowAsideForAdd);

    this.modelForm = this.formBuilder.group({
      cardNumber: [
        "",
        [Validators.maxLength(20)]
      ],
      expiryDate: ["",
        [Validators.maxLength(4)]
      ],
      cvd: ["",
      ],
      streetnumber: ["",
        [Validators.maxLength(19)]
      ],
      streetname: ["",
        [Validators.maxLength(19)]
      ],
      zipcode: ["",
        [Validators.maxLength(9)]
      ],
      address: [""
      ],
      city: ["",
        Validators.maxLength(50)
      ],
      state: ["",
        Validators.maxLength(50)
      ],
      country: ["",
        Validators.maxLength(50)
      ],
      cardType: ["",

      ],
      id: ["",

      ],
      companyId: ["",
      ],
      cardholderName: ["",
        Validators.maxLength(100)
      ],
    })
    this.modelForm.controls['address'].disable();

  }
  checkExpiryLabel() {
    if (this.modelForm.controls["expiryDate"].value == null) return null;
    let current = new Date().getTime();
    let expired = new Date(Number(`20${this.modelForm.controls["expiryDate"].value.substring(0, 2)}`), Number(`${this.modelForm.controls["expiryDate"].value.substring(2, 4)}`) - 1, 1).getTime();
    if (expired - current < 1000 * 60 * 60 * 24 * 30 && expired - current > 0) return 'EXPIRING_SOON';
    if (expired > current) return null;
    return 'EXPIRED';
  }
  save() {
    this.submitted = true;
    if (this.modelForm.invalid) {
      return;
    }
    this.addBtn.setDisabled(true);
    let req = {};
    Object.keys(this.modelForm.value).forEach(key => {
      if (this.modelForm.value[key] != null && this.modelForm.value[key] != "") {
        req[key] = this.modelForm.value[key];
      }
    });
    if (Object.keys(req).length == 0) {
      this.addBtn.setDisabled(false);
      this.closed();
      return;
    }
    req["id"] = this.modelForm.value["id"];
    this.manageCardsService.editCard(req).subscribe(data => {
      this.manageCardsStateService.fastEditCard(data);
      this.addBtn.setDisabled(false);
      this.closed();
    }, err => {
      this.addBtn.setDisabled(false);
    })
  }
}
