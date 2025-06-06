import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { UserTableCustomSubscriptionComponent } from './user-table-custom-subscription.component';
import { UserCustomSubscription } from '../../class/user-custom-subscription';


describe('UserTableCustomSubscriptionComponent unit test', () => {
  let component: UserTableCustomSubscriptionComponent;
  let fixture: ComponentFixture<UserTableCustomSubscriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        NgbModule,
        DynamicTooltipModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [UserTableCustomSubscriptionComponent
      ]
    }).compileComponents();

  });

  it('check "getListHiveSubscribes"', () => {
    const fixture = TestBed.createComponent(UserTableCustomSubscriptionComponent);
    const com = fixture.debugElement.componentInstance;
    com.customSubscriptions = [new UserCustomSubscription({ id: "test", name: "test" }), new UserCustomSubscription({ id: "test2", name: "test2" })];
    expect(com.getListHiveSubscribes()).toEqual("");
  });
  it('check "toggleIsUpdate"', () => {
    const fixture = TestBed.createComponent(UserTableCustomSubscriptionComponent);
    const com = fixture.debugElement.componentInstance;
    com.toggleIsUpdate(true);
    expect(com.isUpdate).toEqual(true);
  });
  it('check "isSeleted"', () => {
    const fixture = TestBed.createComponent(UserTableCustomSubscriptionComponent);
    const com = fixture.debugElement.componentInstance;
    com.customSubscriptions = [{ id: "test" }, { id: "test2" }];
    expect(com.isSeleted({ id: "test" })).toEqual({ id: 'test' });
  });
});