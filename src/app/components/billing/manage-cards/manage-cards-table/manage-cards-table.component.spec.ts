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
import { ManageCardsTableComponent } from './manage-cards-table.component';


describe('ManageCardsTableComponent unit test', () => {
  let component: ManageCardsTableComponent;
  let fixture: ComponentFixture<ManageCardsTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        MatErrorModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [ManageCardsTableComponent
      ]
    }).compileComponents();

  });


  it('check "getExpiredStatus"', () => {
    const fixture = TestBed.createComponent(ManageCardsTableComponent);
    const com = fixture.debugElement.componentInstance;
    com.item = { expiryDate: '1201' };
    expect(com.getExpiredStatus()).toEqual('EXPIRED');
  });
  it('check "parseExpiredDate"', () => {
    const fixture = TestBed.createComponent(ManageCardsTableComponent);
    const com = fixture.debugElement.componentInstance;
    com.item = { expiryDate: '1201' };
    expect(com.parseExpiredDate()).toEqual('Expired');
  });
});