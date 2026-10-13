import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { KeyUpEnterModule } from 'src/app/directives/key-up-enter/key-up-enter.module';
import { TextAreaModule } from 'src/app/directives/text-area/text-area.module';
import { CompanyTagsModule } from '../../companies/company-tags/company-tags.module';
import { DynamicTooltipModule } from '../../shared/dynamic-tooltip/dynamic-tooltip.module';
import { MatErrorModule } from '../../shared/mat-error/mat-error.module';
import { UserCustomSubscriptionModule } from '../../users/users-aside/user-custom-subscription/user-custom-subscription.module';
import { UsersDetailsLeftPanelComponent } from './users-details-left-panel.component';

describe('UsersDetailsLeftPanelComponent unit test', () => {
  let component: UsersDetailsLeftPanelComponent;
  let fixture: ComponentFixture<UsersDetailsLeftPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [provideNgxMask()],
    imports: [CommonModule,
        DynamicTooltipModule,
        MatErrorModule,
        FormsModule,
        NgbModule,
        CompanyTagsModule,
        ReactiveFormsModule,
        UserCustomSubscriptionModule,
        NgxMaskDirective,
        TextAreaModule,
        KeyUpEnterModule,
        HttpClientModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule, UsersDetailsLeftPanelComponent]
}).compileComponents();

  });

  it('check "UsersDetailsLeftPanelComponent"', () => {
    const fixture = TestBed.createComponent(UsersDetailsLeftPanelComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.isPrimaryContact()).toEqual(false);
  });
  it('check "UsersDetailsLeftPanelComponent"', () => {
    const fixture = TestBed.createComponent(UsersDetailsLeftPanelComponent);
    const com = fixture.debugElement.componentInstance;
    com.onChangeJobDescription({ target: { value: "test" } })
    expect(com.user.jobDescription).toEqual("test");
    expect(com.isChange).toEqual(true);
  });
  it('check "parseAddress"', () => {
    const fixture = TestBed.createComponent(UsersDetailsLeftPanelComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.parseAddress({ suiteNumber: null, address: null, postalCode: 123 })).toEqual("No information yet ");
  });
});