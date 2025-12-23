import { Component } from '@angular/core';
import { ManageCardsAddComponent } from '../manage-cards-add/manage-cards-add.component';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-cards-edit',
  templateUrl: './manage-cards-edit.component.html',
  styleUrls: ['./manage-cards-edit.component.scss']
})
export class ManageCardsEditComponent extends ManageCardsAddComponent {
  maskedCardNumber: string

  ngOnInit() {
    let getShowAsideForAdd = this.manageCardsStateService.showAsideForEdit.subscribe(data => {
      this.manageCardsService.getCard(data.id).subscribe((res: any) => {
        this.maskedCardNumber = res.maskedCardNumber;
        this.modelForm.patchValue({
          id: res.id,
          cardType: res.cardType,
          cardholderName: res.cardholderName,
          // cardNumber: res.maskedCardNumber,
          expiryDate: res.expiryDate,
          //  cvd: res.cvd,
          streetnumber: res.streetnumber,
          streetname: res.streetname,
          zipcode: res.zipcode,
          address: res.address,
          city: res.city,
          state: res.state,
          country: res.country,
          companyId: res.companyId,
        });
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
      address: ["",
        Validators.maxLength(50)
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
    console.log("req", req);
    this.manageCardsService.editCard(req).subscribe(data => {
      console.log("edit card response", data);
      this.manageCardsStateService.fastEditCard(data);
      this.addBtn.setDisabled(false);
      this.closed();
    }, err => {
      this.addBtn.setDisabled(false);
    })
  }
}
