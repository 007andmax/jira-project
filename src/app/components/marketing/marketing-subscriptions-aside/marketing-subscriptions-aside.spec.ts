import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { MarketingSubscriptionsAsideComponent } from './marketing-subscriptions-aside.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { MarketingSubscriptionsAddComponent } from './marketing-subscriptions-add/marketing-subscriptions-add.component';
import { MarketingSubscriptionsAsideItemEditComponent } from './marketing-subscriptions-aside-item-edit/marketing-subscriptions-aside-item-edit.component';
import { MarketingSubscriptionsAsideItemInfoComponent } from './marketing-subscriptions-aside-item-info/marketing-subscriptions-aside-item-info.component';

describe('MarketingSubscriptionsAsideComponent unit test', () => {
  let component: MarketingSubscriptionsAsideComponent;
  let fixture: ComponentFixture<MarketingSubscriptionsAsideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        KeyUpEnterModule,
        NgbModule,
        MatErrorModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [MarketingSubscriptionsAsideComponent, MarketingSubscriptionsAsideItemInfoComponent, MarketingSubscriptionsAsideItemEditComponent, MarketingSubscriptionsAddComponent
      ]
    }).compileComponents();

  });

  it('check "close"', () => {
    const fixture = TestBed.createComponent(MarketingSubscriptionsAsideComponent);
    const com = fixture.debugElement.componentInstance;
    com.listCustomSubscription = [
      { id: 1, name: 'test1', selected: true },
      { id: 2, name: 'test2', selected: true }
    ];
    com.close();
    expect(com.listCustomSubscription[0].selected).toEqual(false);
  });

});