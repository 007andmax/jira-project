import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'src/app/components/shared/date-picker/date-picker.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { PaymentsHeaderComponent } from './payments-header.component';


describe('PaymentsHeaderComponent unit test', () => {
  let component: PaymentsHeaderComponent;
  let fixture: ComponentFixture<PaymentsHeaderComponent>;

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
        NoopAnimationsModule, PaymentsHeaderComponent]
}).compileComponents();

  });


  it('check "onSelectStatus"', () => {
    const fixture = TestBed.createComponent(PaymentsHeaderComponent);
    const com = fixture.debugElement.componentInstance;
    com.countFilter = 7;
    expect(com.getTextCountFilters()).toEqual(`Filters (7)`);
  });

});