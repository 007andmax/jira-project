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
import { CompanyProfileApiKeysEditAsideComponent } from './company-profile-api-keys-edit-aside/company-profile-api-keys-edit-aside.component';
import { CompanyProfileApiKeysComponent } from './company-profile-api-keys.component';
import { ApiKeys } from './class/api-keys';

describe('CompanyProfileApiKeysComponent unit test', () => {
  let component: CompanyProfileApiKeysComponent;
  let fixture: ComponentFixture<CompanyProfileApiKeysComponent>;

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
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [CompanyProfileApiKeysComponent,
      ]
    }).compileComponents();

  });

  it('check "updateAPiKey"', () => {
    const fixture = TestBed.createComponent(CompanyProfileApiKeysComponent);
    const com = fixture.debugElement.componentInstance;
    com.list = [new ApiKeys({ id: "test", key: "key", title: "title", companyId: "companyId" })];
    com.updateAPiKey({ id: "test 1", key: "key 1", title: "title 1", companyId: "companyId 1" })
    expect(com.list.length).toEqual(2);
  });
});