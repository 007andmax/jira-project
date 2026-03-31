import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TicketDetailContactDetailsComponent } from './ticket-detail-contact-details.component';
import { TicketDetailContactDetailsHistoryComponent } from './ticket-detail-contact-details-history/ticket-detail-contact-details-history.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { Company } from 'src/app/interfaces/company/company';
import { PreviewPhoneMaskModule } from 'src/app/components/shared/preview-phone-mask/preview-phone-mask.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TicketsTableItemRequestedByModule } from '../../tickets-table/tickets-table-item/tickets-table-item-requested-by/tickets-table-item-requested-by.module';
import { UserLogoPopoverModule } from 'src/app/directives/user-logo-popover/user-logo-popover.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


describe('TicketDetailContactDetailsComponent unit test', () => {
  let component: TicketDetailContactDetailsComponent;
  let fixture: ComponentFixture<TicketDetailContactDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule,
        PreviewPhoneMaskModule,
        InfiniteScrollModule,
        TicketsTableItemRequestedByModule,
        UserLogoPopoverModule,
        NgbModule],
      declarations: [TicketDetailContactDetailsComponent,
        TicketDetailContactDetailsHistoryComponent
      ],
      providers: [TicketDetailContactDetailsComponent]
    }).compileComponents();

  });

  it('check "getTimeFormat"', () => {
    const fixture = TestBed.createComponent(TicketDetailContactDetailsComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getTimeFormat(null)).toEqual("AM");
  });
  it('check "timeFormatter"', () => {
    const fixture = TestBed.createComponent(TicketDetailContactDetailsComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.timeFormatter(null)).toEqual("12:00");
  });
  it('check "getPrimaryPhone"', () => {
    const fixture = TestBed.createComponent(TicketDetailContactDetailsComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getPrimaryPhone()).toEqual("");
  });
  it('check "getDataCompany"', () => {
    const fixture = TestBed.createComponent(TicketDetailContactDetailsComponent);
    const com = fixture.debugElement.componentInstance;
    com.company = {
      "id": "2849ebc9-2c83-41e4-a7cd-ce6b21044e69",
      "name": "bnbv2 1111",
      "domain": null,
      "accountType": "CLIENT",
      "status": "ACTIVE",
      "description": null,
      "clientType": "CLIENT",
      "clientIndustry": null,
      "createdAt": 1689001926769,
      "deletedAt": null,
      "allowCreateTags": false,
      "type": null,
      "emailAlias": null,
      "defaultPaymentMethod": null,
      "paymentTerms": null,
      "companyStatistic": {
        "id": "d285d6fd-d990-41d3-84cd-ce49aa98d0a3",
        "company": null,
        "ticketsSubmitted": 0,
        "ticketsResolved": 0
      },
      "logo": null,
      "techLeadId": null,
      "companyInfo": {
        "primaryAddress": null,
        "addresses": [
          {
            "id": "adfebbfc-18a3-41ed-9072-b137b42b2722",
            "address": null,
            "country": null,
            "countryCode": null,
            "longCity": null,
            "longState": null,
            "shortCity": null,
            "shortState": null,
            "postalCode": null,
            "suiteNumber": null,
            "company": {},
            "phoneNumbers": [
              {
                "id": "577430fc-16b1-408f-b496-824588b33cd5",
                "number": "(123) 213-2131 Ext: 23213",
                "typeNumber": "OFFICE",
                "priority": 1,
                "address": {
                  "id": "adfebbfc-18a3-41ed-9072-b137b42b2722"
                },
                "user": {}
              }
            ],
            "isPrimary": true,
            "locationLat": null,
            "locationLng": null,
            "locationName": "bnbv2 1111",
            "companyId": "2849ebc9-2c83-41e4-a7cd-ce6b21044e69",
            "addressWithSuitNumberAndPostalCode": ""
          },
          {
            "id": "3d8695d3-c99e-4b61-904c-6411dabfbb98",
            "address": null,
            "country": null,
            "countryCode": null,
            "longCity": null,
            "longState": null,
            "shortCity": null,
            "shortState": null,
            "postalCode": null,
            "suiteNumber": null,
            "company": {},
            "phoneNumbers": [
              {
                "id": "aa1ffdcb-34c7-49de-84f8-58cbc1a060d5",
                "number": "(123) 213-2131 Ext: 23213",
                "typeNumber": "OFFICE",
                "priority": 1,
                "address": {
                  "id": "3d8695d3-c99e-4b61-904c-6411dabfbb98"
                },
                "user": {}
              }
            ],
            "isPrimary": false,
            "locationLat": null,
            "locationLng": null,
            "locationName": "bnbv2 1111",
            "companyId": "2849ebc9-2c83-41e4-a7cd-ce6b21044e69",
            "addressWithSuitNumberAndPostalCode": ""
          }
        ],
        "contacts": [
          {
            "id": "e3c4a4c0-be7c-45ce-95fa-8b430c25f05c",
            "accountType": null,
            "company": {
              "default": false,
              "id": "72381bff-127c-4a63-9d2e-6e952350dcbd",
              "accountNumber": null
            },
            "avatar": null,
            "phoneNumbers": null,
            "tags": null,
            "deletedAt": null,
            "twoFactorAuthType": null,
            "isDefault": null,
            "firstName": "ergergergerg",
            "lastName": "",
            "jobDescription": null,
            "isEmailVerified": null,
            "isOwner": null,
            "online": null,
            "lockScreen": null,
            "primaryEmail": "rtkbnrt4gbgb@gmail.com",
            "role": "USER",
            "secondaryEmail": null,
            "startPage": null,
            "status": null,
            "techRole": null,
            "userEnabled": null,
            "requestToChangePassword": null,
            "userStatistic": {},
            "myTicketUpdated": null,
            "jobTypeId": null,
            "lastLoginAt": null,
            "portalAccessStatus": null,
            "userEmailNotifications": null,
            "customSubscriptions": [],
            "customerCompaniesInfo": [],
            "clientCompanyId": "2849ebc9-2c83-41e4-a7cd-ce6b21044e69",
            "userTOTP": null,
            "permissions": null
          }
        ],
        "workingTime": [
          {
            "id": "ee9226a0-b48e-4346-b99e-648d59f8e467",
            "dayOfWeek": "MONDAY",
            "startTime": 0,
            "endTime": 0,
            "isSelected": true
          },
          {
            "id": "7dd3fea6-402b-4ef3-af38-44a8f72bb285",
            "dayOfWeek": "TUESDAY",
            "startTime": 0,
            "endTime": 0,
            "isSelected": true
          },
          {
            "id": "994ff279-46da-4a64-ac7a-c3347d6bf961",
            "dayOfWeek": "WEDNESDAY",
            "startTime": 0,
            "endTime": 0,
            "isSelected": true
          },
          {
            "id": "1ebc29d9-3a87-4c42-9062-3f5322e9e449",
            "dayOfWeek": "THURSDAY",
            "startTime": 0,
            "endTime": 0,
            "isSelected": true
          },
          {
            "id": "330b88dc-2b1f-4dba-844d-ac024821f11b",
            "dayOfWeek": "FRIDAY",
            "startTime": 0,
            "endTime": 0,
            "isSelected": true
          },
          {
            "id": "7c4acff1-dcac-40f8-aa4f-b12f028b3c3e",
            "dayOfWeek": "SATURDAY",
            "startTime": 0,
            "endTime": 0,
            "isSelected": true
          },
          {
            "id": "baaedb6d-960b-40d3-94bd-f2ef0f3c603e",
            "dayOfWeek": "SUNDAY",
            "startTime": 0,
            "endTime": 0,
            "isSelected": true
          }
        ],
        "reputation": 0
      },
      "isUnknown": false,
      "isExample": false,
      "isDefault": false
    };
    com.getDataCompany();
    expect(com.primaryContact).toEqual(undefined);
    expect(com.primaryAddress.id).toEqual("adfebbfc-18a3-41ed-9072-b137b42b2722");
    expect(com.primaryPhone.number).toEqual("(123) 213-2131 Ext: 23213");
    expect(com.locationBilling).toEqual("");
  });
});