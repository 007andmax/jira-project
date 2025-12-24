import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { Company } from 'src/app/interfaces/company/company';
import { ManageCardsEditComponent } from './manage-cards-edit.component';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';


describe('ManageCardsEditComponent unit test', () => {
  let component: ManageCardsEditComponent;
  let fixture: ComponentFixture<ManageCardsEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        DatePickerModule,
        NumberModule,
        FormsModule,
        MatErrorModule,
        ReactiveFormsModule,
        DisabledBtnModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [ManageCardsEditComponent
      ]
    }).compileComponents();

  });


  it('check "onSelectCompany"', () => {
    const fixture = TestBed.createComponent(ManageCardsEditComponent);
    const com = fixture.debugElement.componentInstance;
    com.ngOnInit();
    com.modelForm.controls['expiryDate'].value = null;
    expect(com.checkExpiryLabel()).toEqual(null);
    com.modelForm.controls['expiryDate'].value = '1201';
    expect(com.checkExpiryLabel()).toEqual('EXPIRED');
  });

});