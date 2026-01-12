import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { GlNumbersDropDownModule } from 'src/app/components/inventory/gl-numbers-drop-down/gl-numbers-drop-down.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CompanySubscriptionComponent } from './company-subscription.component';


describe('CompanySubscriptionComponent unit test', () => {
  let component: CompanySubscriptionComponent;
  let fixture: ComponentFixture<CompanySubscriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        MatErrorModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [CompanySubscriptionComponent
      ],
    }).compileComponents();

  });
  it('check "remove"', () => {
    const fixture = TestBed.createComponent(CompanySubscriptionComponent);
    const com = fixture.debugElement.componentInstance;
    com.remove(0);
    expect(com.subscriptions[0].selected).toEqual(false);
  });
  it('check "selected"', () => {
    const fixture = TestBed.createComponent(CompanySubscriptionComponent);
    const com = fixture.debugElement.componentInstance;
    com.selected(0);
    expect(com.subscriptions[0].selected).toEqual(true);
  });
});