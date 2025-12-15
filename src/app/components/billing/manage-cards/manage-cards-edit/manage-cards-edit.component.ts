import { Component } from '@angular/core';
import { ManageCardsAddComponent } from '../manage-cards-add/manage-cards-add.component';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-cards-edit',
  templateUrl: './manage-cards-edit.component.html',
  styleUrls: ['./manage-cards-edit.component.scss']
})
export class ManageCardsEditComponent extends ManageCardsAddComponent {


  ngOnInit() {
    let getShowAsideForAdd = this.manageCardsStateService.showAsideForEdit.subscribe(data => {
      this.manageCardsService.getCard(data.id).subscribe((res: any) => {
        this.modelForm.patchValue({
          id: res.id,
          cardType: res.cardType,
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
      ],
      expiryDate: ["",
      ],
      cvd: ["",
      ],
      streetnumber: ["",
      ],
      streetname: ["",
      ],
      zipcode: ["",
      ],
      address: ["",

      ],
      city: ["",

      ],
      state: ["",

      ],
      country: ["",

      ],
      cardType: ["",

      ],
      id: ["",

      ],
      companyId: ["",
      ],

    })

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
