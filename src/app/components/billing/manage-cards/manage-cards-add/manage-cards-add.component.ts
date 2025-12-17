import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CompanyDropDownComponent } from 'src/app/components/shared/company-drop-down/company-drop-down.component';
import { DisabledBtnDirective } from 'src/app/directives/disabled-btn/disabled-btn.directive';
import { Company } from 'src/app/interfaces/company/company';
import { ManageCardsService } from 'src/app/services/manage-cards/manage-cards.service';
import { CompaniesStateService } from 'src/app/states/company/companies-state.service';
import { ManageCardsStateService } from 'src/app/states/manage-cards/manage-cards-state.service';
import { UsersStateService } from 'src/app/states/users/users-state.service';

@Component({
  selector: 'app-manage-cards-add',
  templateUrl: './manage-cards-add.component.html',
  styleUrls: ['./manage-cards-add.component.scss']
})
export class ManageCardsAddComponent {
  selectedCompany: Company;
  sub: Subscription = new Subscription();
  modelForm: UntypedFormGroup;
  submitted: boolean = false;
  showAdd: boolean = false;
  @ViewChild('addBtn', { static: false }) addBtn: DisabledBtnDirective;
  @ViewChild('companyDP', { static: true }) companyDP: CompanyDropDownComponent;
  constructor(
    public manageCardsStateService: ManageCardsStateService,
    public cd: ChangeDetectorRef,
    public formBuilder: UntypedFormBuilder,
    public manageCardsService: ManageCardsService,
    public companiesStateService: CompaniesStateService,
    private usersStateService: UsersStateService


  ) { }
  ngOnInit() {
    let getShowAsideForAdd = this.manageCardsStateService.showAsideForAdd.subscribe(data => {
      this.showAdd = true;

    })
    this.sub.add(getShowAsideForAdd);

    this.modelForm = this.formBuilder.group({
      cardNumber: [
        "",
        [Validators.required, Validators.maxLength(20)]
      ],
      expiryDate: ["",
        [Validators.required, Validators.maxLength(4)]
      ],
      cvd: ["",
        [Validators.required]
      ],
      streetnumber: ["",
        [Validators.required, Validators.maxLength(19)]
      ],
      streetname: ["",
        [Validators.required, Validators.maxLength(19)]
      ],
      zipcode: ["",
        [Validators.required, Validators.maxLength(9)]
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
      companyId: ["",
        [Validators.required]
      ],

    })

  }
  onSelectCompany(data) {
    this.selectedCompany = data;
    this.modelForm.controls['companyId'].setValue(data.id);
    console.log("selectedCompany", data);

  }
  add() {
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
    this.manageCardsService.addCard(req).subscribe(data => {
      this.addBtn.setDisabled(false);
      this.closed();
    }, err => {
      this.addBtn.setDisabled(false);
    })
  }
  closed() {
    this.companyDP.clearWithOutChanges();
    this.selectedCompany = null;
    this.submitted = false;
    this.showAdd = false;
    this.modelForm.reset();
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  get f2() {
    return this.modelForm.controls;
  }
}
