import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { PreviewPhoneMaskModule } from 'src/app/components/shared/preview-phone-mask/preview-phone-mask.module';
import { UsersTableCompanyByComponent } from './users-table-company-by.component';
import { TicketsListService } from 'src/app/components/tickets/tickets/services/tickets-list.service';


describe('UsersTableCompanyByComponent unit test', () => {
  let component: UsersTableCompanyByComponent;
  let fixture: ComponentFixture<UsersTableCompanyByComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        FormsModule,
        NgbModule,
        PreviewPhoneMaskModule,
        NgxMaskDirective,
        HttpClientModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule],
    providers: [provideNgxMask(), TicketsListService],
    declarations: [UsersTableCompanyByComponent],
}).compileComponents();

  });

  it('check "getUserName"', () => {
    const fixture = TestBed.createComponent(UsersTableCompanyByComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getUserName({ firstName: 'John', lastName: 'Doe' })).toEqual('John Doe');
  });

  it('check "getPrimaryPhoneNumber"', () => {
    const fixture = TestBed.createComponent(UsersTableCompanyByComponent);
    const com = fixture.debugElement.componentInstance;
    com.company = {
      companyInfo: {
        addresses: [{ isPrimary: true, phoneNumbers: [{ priority: 1, number: '1234567890' }] }]
      }
    } as any;
    expect(com.getPrimaryPhoneNumber()).toEqual('1234567890');
  });
  it('check "getPrimaryShippingAddress"', () => {
    const fixture = TestBed.createComponent(UsersTableCompanyByComponent);
    const com = fixture.debugElement.componentInstance;
    com.company = {
      companyInfo: {
        addresses: [{ isPrimary: true, phoneNumbers: [{ priority: 0, number: '1234567890' }] }]
      }
    } as any;
    expect(com.getPrimaryShippingAddress()).toEqual({ isPrimary: true, phoneNumbers: [{ priority: 0, number: '1234567890' }] });
  });
  it('check "getContact"', () => {
    const fixture = TestBed.createComponent(UsersTableCompanyByComponent);
    const com = fixture.debugElement.componentInstance;
    com.company = {
      companyInfo: {
        contacts: [{ isPrimary: true, phoneNumbers: [{ priority: 0, number: '1234567890' }] }]
      }
    } as any;
    expect(com.getContact()).toEqual({ isPrimary: true, phoneNumbers: [{ priority: 0, number: '1234567890' }] });
  });
});