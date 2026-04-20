import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';
import { CompanyProfileApiKeysAddAsideComponent } from './company-profile-api-keys-add-aside.component';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';

describe('CompanyProfileApiKeysAddAsideComponent unit test', () => {
  let component: CompanyProfileApiKeysAddAsideComponent;
  let fixture: ComponentFixture<CompanyProfileApiKeysAddAsideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        FormsModule,
        DropDownModule,
        NgbModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatChipListModule,
        MatChipModule,
        HttpClientModule,
        DisabledBtnModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule],
    declarations: [CompanyProfileApiKeysAddAsideComponent]
}).compileComponents();

  });

  it('check "userReadable"', () => {
    const fixture = TestBed.createComponent(CompanyProfileApiKeysAddAsideComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.userReadable("EDIT_TICKETS")).toEqual("Edit Tickets");
  });
  it('check "togglePermission"', () => {
    const fixture = TestBed.createComponent(CompanyProfileApiKeysAddAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.ngOnInit();
    com.togglePermission("EDIT_TICKETS")
    expect(com.modelForm.controls["permissions"].value).toEqual(["EDIT_TICKETS"]);
  });
  it('check "closed"', () => {
    const fixture = TestBed.createComponent(CompanyProfileApiKeysAddAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.ngOnInit();
    com.submitted = true;
    com.closed();
    expect(com.submitted).toEqual(false);
    expect(com.opened).toEqual(false);
  });
  it('check "add"', () => {
    const fixture = TestBed.createComponent(CompanyProfileApiKeysAddAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.ngOnInit();
    com.add();
    expect(com.submitted).toEqual(true);
  });
  it('check "isPermissionDisabled"', () => {
    const fixture = TestBed.createComponent(CompanyProfileApiKeysAddAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.ngOnInit();
    expect(com.isPermissionDisabled("CREATE_COMPANIES")).toEqual(true);
  });
});