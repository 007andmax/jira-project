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
import { ManageCardsAddComponent } from './manage-cards-add.component';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';


describe('ManageCardsAddComponent unit test', () => {
  let component: ManageCardsAddComponent;
  let fixture: ComponentFixture<ManageCardsAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        DatePickerModule,
        NumberModule,
        FormsModule,
        MatErrorModule,
        HttpClientModule,
        DisabledBtnModule,
        ReactiveFormsModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [ManageCardsAddComponent
      ]
    }).compileComponents();

  });


  it('check "onSelectCompany"', () => {
    const fixture = TestBed.createComponent(ManageCardsAddComponent);
    const com = fixture.debugElement.componentInstance;
    com.ngOnInit();
    com.onSelectCompany({ id: 1 });
    expect(com.modelForm.controls['companyId'].value).toEqual(1);
  });

});