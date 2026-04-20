import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { UsersDetailsLeftPanelComponent } from 'src/app/components/users-details/users-details-left-panel/users-details-left-panel.component';
import { MarketingSubscriptionsAddComponent } from './marketing-subscriptions-add.component';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('MarketingSubscriptionsAddComponent unit test', () => {
  let component: MarketingSubscriptionsAddComponent;
  let fixture: ComponentFixture<MarketingSubscriptionsAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        MatErrorModule,
        FormsModule,
        HttpClientModule,
        NgbModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule, MarketingSubscriptionsAddComponent],
    providers: [NgbActiveModal]
}).compileComponents();

  });

  it('check "checkDublicate"', () => {
    const fixture = TestBed.createComponent(MarketingSubscriptionsAddComponent);
    const com = fixture.debugElement.componentInstance;
    com.marketingSubscriptionList = [
      { id: 1, name: 'test1' },
      { id: 2, name: 'test2' }
    ];
    com.name = 'test1';
    expect(com.checkDublicate()).toEqual(true);
  });

});