import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersFilterSubscriptionsComponent } from './users-filter-subscriptions.component';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { MatFormFieldModule } from 'src/app/components/shared/mat-form-field/mat-form-field.module';
import { MatChipListModule } from 'src/app/components/shared/mat-chip-list/mat-chip-list.module';
import { MatChipModule } from 'src/app/components/shared/mat-chip/mat-chip.module';

describe('UsersFilterSubscriptionsComponent unit test', () => {
  let component: UsersFilterSubscriptionsComponent;
  let fixture: ComponentFixture<UsersFilterSubscriptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        HttpClientModule,
        NgbModule,
        MatFormFieldModule,
        MatErrorModule,
        MatChipListModule,
        MatChipModule,
        ReactiveFormsModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [UsersFilterSubscriptionsComponent
      ]
    }).compileComponents();

  });

  it('check "setSubscriptions"', () => {
    const fixture = TestBed.createComponent(UsersFilterSubscriptionsComponent);
    const com = fixture.debugElement.componentInstance;
    com.setSubscriptions();
    expect(com.subscriptions.length).toEqual(3);
    expect(com.reqSubscriptions.length).toEqual(3);
  });
  it('check "onSearch"', () => {
    const fixture = TestBed.createComponent(UsersFilterSubscriptionsComponent);
    const com = fixture.debugElement.componentInstance;
    com.setSubscriptions();
    com.onSearch({ target: { value: "invoice" } });
    expect(com.subscriptions.length).toEqual(1);
  });
  it('check "clearWithOutChanges"', () => {
    const fixture = TestBed.createComponent(UsersFilterSubscriptionsComponent);
    const com = fixture.debugElement.componentInstance;
    com.setSubscriptions();
    com.clearWithOutChanges();
    expect(com.subscriptions.length).toEqual(3);
    expect(com.reqSubscriptions.length).toEqual(3);
  });
  it('check "updateDefault"', () => {
    const fixture = TestBed.createComponent(UsersFilterSubscriptionsComponent);
    const com = fixture.debugElement.componentInstance;
    com.updateDefault("invoiceSubscription", { id: "test" });
    expect(com.defaultSubscriptions["invoiceSubscription"].enabled).toEqual(false);
  });
  it('check "updateCustom"', () => {
    const fixture = TestBed.createComponent(UsersFilterSubscriptionsComponent);
    const com = fixture.debugElement.componentInstance;
    com.updateCustom({ id: "test" }, { id: "test" });
    expect(com.customSubscriptions.length).toEqual(1);
  });
  it('check "isSelected"', () => {
    const fixture = TestBed.createComponent(UsersFilterSubscriptionsComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.isSelected({ id: "test" })).toEqual(undefined);
  });
  it('check "isSeletedDefault"', () => {
    const fixture = TestBed.createComponent(UsersFilterSubscriptionsComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.isSeletedDefault("invoiceSubscription")).toEqual(true);
  });
  it('check "isSeletedDefault"', () => {
    const fixture = TestBed.createComponent(UsersFilterSubscriptionsComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.isSeletedCustom({ id: "test" })).toEqual(undefined);
  });
});