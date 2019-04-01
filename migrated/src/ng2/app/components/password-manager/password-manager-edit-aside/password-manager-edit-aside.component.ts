import {Component, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable, Subject, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

import { PasswordManagerService } from "../../../services/password-manager/password-manager.service";
import { PASSWORD_RECORD_TYPES, PASSWORD_RECORD_TYPES_ENUM } from "../../../const/password-record-types";
import { CompaniesService } from "../../../services/company/companies.service";


@Component({
  selector: 'app-password-manager-edit-aside',
  templateUrl: './password-manager-edit-aside.component.html',
  styleUrls: ['./password-manager-edit-aside.component.scss']
})
export class PasswordManagerEditAsideComponent implements OnInit {

  public createPasswordRecord: FormGroup;
  @ViewChild('instance') instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  focusClients$ = new Subject<string>();
  clickClients$ = new Subject<string>();
  public clientsList: any;
  public type: any;

  constructor(
    private passwordManagerService: PasswordManagerService,
    private fb: FormBuilder,
    private companiesService: CompaniesService
  ) { }

  ngOnInit() {
    this.showAddForm();
    this.initForm();
    this.getCLientsList();
    this.type = 0;
  }

  public _opened: boolean = false;

  public _toggleSidebar() {
    this._opened = !this._opened;
  }

  public showAddForm() {
    this.passwordManagerService.showAddForm.subscribe((res) => {
      this._opened = true;
    })
  }

  public changeType(event) {
    this.type = PASSWORD_RECORD_TYPES_ENUM[event.UPPERCASE];
  }

  public initForm(){
    this.createPasswordRecord = this.fb.group({
      description: [''],
      client: [''],
      type: [''],
      ssid: [''],
      userName: [''],
      password: [''],
      key: [''],
      link: [''],
      url: [''],
      code: [''],
      userOrDevice: [''],
      ipAdres: [''],
      port: [''],
      expiryDate: ['']
    });
  }

  save() {
    console.log(this.createPasswordRecord);
  }

  search = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => PASSWORD_RECORD_TYPES)
    );
  };

  searchClients = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.clientsList
        : this.clientsList && this.clientsList.filter(v => v['name'].toLowerCase().indexOf(term.toLowerCase()) > -1)))
    );
  };

  formatter = (result: string) => {
    return result['TITLE'];
  };

  formatterClients = (result: string) => {
    return result['name'];
  };

  getCLientsList() {
    this.companiesService.getCompaniesList().subscribe((res) => {
      this.clientsList = res
    })
  }

}
