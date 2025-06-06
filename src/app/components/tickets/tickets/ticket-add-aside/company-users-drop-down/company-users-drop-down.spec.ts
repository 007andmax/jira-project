import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { CompanyUsersDropDownComponent } from './company-users-drop-down.component';

describe('CompanyUsersDropDownComponent unit test', () => {
  let component: CompanyUsersDropDownComponent;
  let fixture: ComponentFixture<CompanyUsersDropDownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        NgbModule,
        MatErrorModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [CompanyUsersDropDownComponent
      ]
    }).compileComponents();

  });

  it('check "selectItemWithOutChanges"', () => {
    const fixture = TestBed.createComponent(CompanyUsersDropDownComponent);
    const com = fixture.debugElement.componentInstance;
    com.selectItemWithOutChanges("test");
    expect(com.selectedItem).toEqual(undefined);
  }); it('check "onSelectUser"', () => {
    const fixture = TestBed.createComponent(CompanyUsersDropDownComponent);
    const com = fixture.debugElement.componentInstance;
    com.onSelectUser("test", "123");
    expect(com.selectedItem).toEqual("test");
    expect(com.selectedCustomerCompany).toEqual("123");
  });
  it('check "getUserName"', () => {
    const fixture = TestBed.createComponent(CompanyUsersDropDownComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getUserName({ firstName: "test", lastName: "123" })).toEqual("test 123");
  });
  it('check "getCompanyName"', () => {
    const fixture = TestBed.createComponent(CompanyUsersDropDownComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getCompanyName({ customerCompaniesInfo: [{ clientCompanyName: "1" }, { clientCompanyName: "3" }] })).toEqual("1,3");
  });
});