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
import { QuotesItemComponent } from './quotes-item.component';
import { TicketsTableItemRequestedByModule } from 'src/app/components/tickets/tickets/tickets-table/tickets-table-item/tickets-table-item-requested-by/tickets-table-item-requested-by.module';
import { UserLogoPopoverModule } from 'src/app/directives/user-logo-popover/user-logo-popover.module';


describe('QuotesItemComponent unit test', () => {
  let component: QuotesItemComponent;
  let fixture: ComponentFixture<QuotesItemComponent>;

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
        NoopAnimationsModule,
        TicketsTableItemRequestedByModule,
        UserLogoPopoverModule,
        NgbModule],
      declarations: [QuotesItemComponent
      ],
    }).compileComponents();

  });
  it('check "getUserName"', () => {
    const fixture = TestBed.createComponent(QuotesItemComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getUserName(null)).toEqual('');
  });

});