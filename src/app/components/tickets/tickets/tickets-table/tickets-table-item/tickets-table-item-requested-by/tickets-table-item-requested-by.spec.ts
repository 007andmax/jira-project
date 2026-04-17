import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaskModule } from 'ngx-mask';
import { PreviewPhoneMaskModule } from 'src/app/components/shared/preview-phone-mask/preview-phone-mask.module';
import { TicketsTableItemRequestedByComponent } from './tickets-table-item-requested-by.component';
import { TicketsListService } from '../../../services/tickets-list.service';


describe('TicketsTableItemRequestedByComponent unit test', () => {
  let component: TicketsTableItemRequestedByComponent;
  let fixture: ComponentFixture<TicketsTableItemRequestedByComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        NgbModule,
        PreviewPhoneMaskModule,
        NgxMaskModule.forRoot(),
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      providers: [TicketsListService],
      declarations: [TicketsTableItemRequestedByComponent
      ],
    }).compileComponents();

  });

  it('check "getUserName"', () => {
    const fixture = TestBed.createComponent(TicketsTableItemRequestedByComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getUserName({ firstName: 'John', lastName: 'Doe' })).toEqual('John Doe');
  });
  it('check "getPrimaryPhoneNumber"', () => {
    const fixture = TestBed.createComponent(TicketsTableItemRequestedByComponent);
    const com = fixture.debugElement.componentInstance;
    com.requestedUser = { phoneNumbers: [{ priority: 0, number: '1234567890' }] } as any;
    expect(com.getPrimaryPhoneNumber()).toEqual('1234567890');
  });
});