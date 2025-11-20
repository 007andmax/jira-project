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
import { RecurringTicketsAddAsideComponent } from './recurring-tickets-add-aside.component';

describe('RecurringTicketsAddAsideComponent unit test', () => {
  let component: RecurringTicketsAddAsideComponent;
  let fixture: ComponentFixture<RecurringTicketsAddAsideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        MatFormFieldModule,
        FormsModule,
        DropDownModule,
        NgbModule,
        DynamicTooltipModule,
        MatErrorModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [RecurringTicketsAddAsideComponent
      ]
    }).compileComponents();

  });

  it('check "selectProduct"', () => {
    const fixture = TestBed.createComponent(RecurringTicketsAddAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.selectProduct({ id: 1, name: 'Product 1', cost: 10, sale: 15 }, 0);
    expect(com.products[0].cost).toEqual(10)
    expect(com.products[0].sale).toEqual(15)
  });
  it('check "onPastDescriptionService"', () => {
    const fixture = TestBed.createComponent(RecurringTicketsAddAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.services = [{ description: '' }];
    com.onPastDescriptionService('Test Description', 0);
    expect(com.services[0].description).toEqual('Test Description')
  });
  it('check "selectDuration"', () => {
    const fixture = TestBed.createComponent(RecurringTicketsAddAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.services = [{ duration: 0 }];
    com.selectDuration({ hour: 0, minutes: 30 }, 0);
    expect(com.services[0].duration).toEqual(0.5)
  });
  it('check "addProduct"', () => {
    const fixture = TestBed.createComponent(RecurringTicketsAddAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.addProduct();
    expect(com.products.length).toEqual(1)
  });
  it('check "addService"', () => {
    const fixture = TestBed.createComponent(RecurringTicketsAddAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.addService();
    expect(com.services.length).toEqual(1)
  });
  it('check "removeProduct"', () => {
    const fixture = TestBed.createComponent(RecurringTicketsAddAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.addProduct();
    com.removeProduct(0)
    expect(com.products.length).toEqual(0)
  });
  it('check "removeService"', () => {
    const fixture = TestBed.createComponent(RecurringTicketsAddAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.addService();
    com.removeService(0);
    expect(com.services.length).toEqual(0)
  });
  it('check "getNameOrDescription"', () => {
    const fixture = TestBed.createComponent(RecurringTicketsAddAsideComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getNameOrDescription({ name: "test" })).toEqual("test")
  });
});