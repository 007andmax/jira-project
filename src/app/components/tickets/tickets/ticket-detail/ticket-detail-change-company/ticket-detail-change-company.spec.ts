import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { TicketDetailChangeCompanyComponent } from './ticket-detail-change-company.component';
import { CompanyDropDownModule } from 'src/app/components/shared/company-drop-down/company-drop-down.module';
import { DropDownModule } from 'src/app/components/shared/drop-down/drop-down.module';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { TicketsPermissionsService } from '../../ticket-edit-aside/services/tickets-permissions.service';

describe('TicketDetailChangeCompanyComponent unit test', () => {
  let component: TicketDetailChangeCompanyComponent;
  let fixture: ComponentFixture<TicketDetailChangeCompanyComponent>;

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
        NoopAnimationsModule,
        DynamicTooltipModule,
        DropDownModule,
        CompanyDropDownModule],
    declarations: [TicketDetailChangeCompanyComponent],
    providers: [TicketsPermissionsService]
}).compileComponents();

  });

  it('check "checkExistServicesProducts"', () => {
    const fixture = TestBed.createComponent(TicketDetailChangeCompanyComponent);
    const com = fixture.debugElement.componentInstance;
    com.ticketProfile.updates = [{ type: "PRODUCT" }, { type: "PRODUCT" }];
    expect(com.checkExistServicesProducts()).toEqual(true);
  });
});