import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserCustomSubscriptionComponent } from './user-custom-subscription.component';

describe('UserCustomSubscriptionComponent unit test', () => {
  let component: UserCustomSubscriptionComponent;
  let fixture: ComponentFixture<UserCustomSubscriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        NgbModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [UserCustomSubscriptionComponent
      ]
    }).compileComponents();

  });

  it('check "selected"', () => {
    const fixture = TestBed.createComponent(UserCustomSubscriptionComponent);
    const com = fixture.debugElement.componentInstance;
    com.selected({ id: 1, isExist: false });
    expect(com.customSubscriptions).toEqual([{ id: 1, isExist: false }]);
    com.selected({ id: 1 })
    expect(com.customSubscriptions.length).toEqual(0);
  });
  it('check "isSeleted"', () => {
    const fixture = TestBed.createComponent(UserCustomSubscriptionComponent);
    const com = fixture.debugElement.componentInstance;
    com.selected({ id: 1 })
    expect(com.isSeleted({ id: 1 })).toEqual({ id: 1, isExist: false });
  });
  it('check "showPlaceholder"', () => {
    const fixture = TestBed.createComponent(UserCustomSubscriptionComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.showPlaceholder()).toEqual(false);
  });
});