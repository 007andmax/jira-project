import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { TicketDetailProfileUpdatesProductEditComponent } from './ticket-detail-profile-updates-product-edit.component';
import { ProductListModule } from 'src/app/components/shared/product-list/product-list.module';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';
import { NumberModule } from 'src/app/directives/number/number.module';
import { ToFixedModule } from 'src/app/directives/to-fixed/to-fixed.module';
import { TicketsListService } from '../../../../services/tickets-list.service';
import { TicketProfileProduct } from '../../../../class/ticket-profile-product';

describe('TicketDetailProfileUpdatesProductEditComponent unit test', () => {
  let component: TicketDetailProfileUpdatesProductEditComponent;
  let fixture: ComponentFixture<TicketDetailProfileUpdatesProductEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        FormsModule,
        HttpClientModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        CommonModule,
        NgbModule,
        ProductListModule,
        MatChipModule,
        MatFormFieldModule,
        MatChipListModule,
        MatErrorModule,
        NumberModule,
        ToFixedModule,
        NoopAnimationsModule, TicketDetailProfileUpdatesProductEditComponent],
    providers: [UntypedFormBuilder, TicketsListService]
}).compileComponents();

  });

  it('check "getTotal"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileUpdatesProductEditComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getTotal(20, 1)).toEqual("20.00");
  });
  it('check "onChangeSale"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileUpdatesProductEditComponent);
    const com = fixture.debugElement.componentInstance;
    com.editProduct = new TicketProfileProduct();
    com.editProduct.item = { versionedId: "test", sale: 100, sale_str: "50" };
    com.onChangeSale({ target: { value: 11 } });
    expect(com.editProduct.item.sale).toEqual(11)
    expect(com.editProduct.item.sale_str).toEqual("11.00")
  });
  it('check "onValidateSaleCost"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileUpdatesProductEditComponent);
    const com = fixture.debugElement.componentInstance;
    com.editProduct = new TicketProfileProduct();
    com.editProduct.item = { versionedId: "test", sale: 100, cost: 50 };
    com.valdiateSaleCost = false;
    com.onValidateSaleCost();
    expect(com.valdiateSaleCost).toEqual(true)
  });
  it('check "onChangeProduct"', () => {
    const fixture = TestBed.createComponent(TicketDetailProfileUpdatesProductEditComponent);
    const com = fixture.debugElement.componentInstance;
    com.editProduct = new TicketProfileProduct();
    com.editProduct.item = { versionedId: "test", sale: 100, cost: 50 };
    com.onChangeProduct({ versionedId: "test", sale: 100, cost: 50 });
    expect(com.valdiateSaleCost).toEqual(true)
  });
});