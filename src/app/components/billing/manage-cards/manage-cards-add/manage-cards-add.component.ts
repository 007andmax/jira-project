import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CompanyDropDownComponent } from 'src/app/components/shared/company-drop-down/company-drop-down.component';
import { TitleListType } from 'src/app/components/tickets/tickets/tickets-header/class/title-list-type';
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
  months = [];
  years = [];
  selectedMonth: TitleListType;
  selectedYear: TitleListType;
  constructor(
    public manageCardsStateService: ManageCardsStateService,
    public cd: ChangeDetectorRef,
    public formBuilder: UntypedFormBuilder,
    public manageCardsService: ManageCardsService,
    public companiesStateService: CompaniesStateService,
    private usersStateService: UsersStateService


  ) { }
  ngOnInit() {
    for (let i = 1; i <= 12; i++) {
      this.months.push(new TitleListType(`${i < 10 ? '0' + i : i}`, `${i < 10 ? '0' + i : i}`));
    }
    for (let i = new Date().getFullYear() - 1; i <= new Date().getFullYear() + 20; i++) {
      this.years.push(new TitleListType(`${i}`, `${i}`.substring(2, 4)));
    }
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
        [Validators.maxLength(19)]
      ],
      streetname: ["",
        [Validators.maxLength(19)]
      ],
      zipcode: ["",
        [Validators.maxLength(9)]
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
      cardholderName: ["",
        Validators.maxLength(100)
      ],
    })

  }
  onSelectMonth(event) {
    this.selectedMonth = event;
    if (this.selectedYear) this.modelForm.controls['expiryDate'].setValue(this.selectedYear.type + this.selectedMonth.type);
  }
  onSelectYear(event) {
    this.selectedYear = event;
    if (this.selectedMonth) this.modelForm.controls['expiryDate'].setValue(this.selectedYear.type + this.selectedMonth.type);
  }
  onSelectCompany(data) {
    this.selectedCompany = data;
    this.modelForm.controls['companyId'].setValue(data.id);
  }
  add() {
    this.submitted = true;
    console.log(this.modelForm.value);
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
