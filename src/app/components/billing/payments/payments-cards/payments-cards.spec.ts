import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { PaymentsCardsComponent } from './payments-cards.component';


describe('PaymentsCardsComponent unit test', () => {
  let component: PaymentsCardsComponent;
  let fixture: ComponentFixture<PaymentsCardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        DatePickerModule,
        NumberModule,
        FormsModule,
        MatErrorModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [PaymentsCardsComponent
      ]
    }).compileComponents();

  });


  it('check "checkCardForRemove"', () => {
    const fixture = TestBed.createComponent(PaymentsCardsComponent);
    const com = fixture.debugElement.componentInstance;
    com.selectedItem = { paymentData: [] };
    com.checkCardForRemove();
    expect(com.selectedItem).toEqual(null);
  });
  it('check "setDefaultScoll"', () => {
    const fixture = TestBed.createComponent(PaymentsCardsComponent);
    const com = fixture.debugElement.componentInstance;
    com.showPreloader = false;
    com.setDefaultScoll();
    expect(com.showPreloader).toEqual(true);
  });
});