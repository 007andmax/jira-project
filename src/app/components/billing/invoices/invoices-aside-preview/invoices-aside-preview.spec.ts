import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CompanySetting } from 'src/app/components/companies/class/company-setting';
import { Invoice } from '../class/invoice';
import { DynamicTooltipModule } from 'src/app/components/shared/dynamic-tooltip/dynamic-tooltip.module';
import { PreviewPhoneMaskModule } from 'src/app/components/shared/preview-phone-mask/preview-phone-mask.module';
import { InvoicesAsidePreviewComponent } from './invoices-aside-preview.component';



describe('InvoicesAsidePreviewComponent unit test', () => {
  let component: InvoicesAsidePreviewComponent;
  let fixture: ComponentFixture<InvoicesAsidePreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        PreviewPhoneMaskModule,
        DynamicTooltipModule,
        NgbModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [InvoicesAsidePreviewComponent
      ]
    }).compileComponents();

  });

  it('check "getServiceTaxes"', () => {
    const fixture = TestBed.createComponent(InvoicesAsidePreviewComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getServiceTaxes({ taxes: [[{ name: "test", rate: 10 }]] })).toEqual("test 10%");
  });
  it('check "getSelectedTaxes"', () => {
    const fixture = TestBed.createComponent(InvoicesAsidePreviewComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getSelectedTaxes([{ name: "test", rate: 10 }])).toEqual("test 10%");
  });
  it('check "getDuration"', () => {
    const fixture = TestBed.createComponent(InvoicesAsidePreviewComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getDuration(2)).toEqual("02:00 hr(s)");
  });
  it('check "getSubTotalWithDiscount" && "getSubTotal" && "getTotalDiscount"', () => {
    const fixture = TestBed.createComponent(InvoicesAsidePreviewComponent);
    const com = fixture.debugElement.componentInstance;
    com.invoiceProfile = {
      "billTo": null,
      "shipTo": null,
      "company": {
        "id": "52dfe577-a8ac-4eb7-8a9f-0fed029c6ce1",
        "name": "Apple",
        "quoteExpirationDate": null,
        "defaulTticketSortOrder": null
      },
      "companyName": "Apple",
      "taxId": "55343434342 & 2 wef",
      "taxIdDescription": "tax description value",
      "phoneNumbers": [
        {
          "id": "e905e30f-53a1-4a4d-82cd-e99a131969ac",
          "number": "(457) 878-4323 Ext: 32323",
          "typeNumber": "OFFICE",
          "priority": 0
        },
        {
          "id": "730c5ce6-fd25-402a-80e2-1dc405053edb",
          "number": "(342) 342-3423 Ext: 323232",
          "typeNumber": "MOBILE",
          "priority": 0
        }
      ],
      "defaultShipTo": null,
      "defaultBillTo": null,
      "techCompanyName": "Active Information Systems2025 DEV",
      "billingAddress": "323, HT Road, Kushaiguda Industrial Area, Kushaiguda\nSecunderabad, Telangana\n500062",
      "shippingAddress": null,
      "billingLocationName": "Apple",
      "shippingLocationName": null,
      "senderAddress": "3333\nBishkek, Chuy Province",
      "senderUser": {
        "id": "5efd63e1-2add-4208-9abb-ef0035a34213",
        "company": {
          "id": "72381bff-127c-4a63-9d2e-6e952350dcbd",
          "name": "Active Information Systems2025 DEV",
          "quoteExpirationDate": 30,
          "defaulTticketSortOrder": "CREATED_DATE_DESC"
        },
        "firstName": "Ben2",
        "lastName": "Qucker",
        "phoneNumbers": [],
        "status": "About Me Information",
        "jobDescription": null,
        "primaryEmail": "bnjmn.nicholson@gmail.com",
        "secondaryEmail": null,
        "deletedAt": null,
        "role": null,
        "techRole": "Administrator21",
        "startPage": "UNASSIGNED",
        "userStatistic": {
          "id": "305a5cdc-bd06-4f11-b400-da18c9fd93a4",
          "ticketsSubmitted": 0,
          "ticketsResolved": 916
        },
        "tags": [],
        "avatar": null,
        "online": true,
        "lockScreen": true,
        "isEmailVerified": false,
        "isContact": true,
        "userEnabled": true,
        "isDefault": false,
        "priority": 0,
        "subscription": null,
        "twoFactorAuthType": "DISABLED",
        "isOwner": true,
        "disabledWelcomeWizard": true,
        "requestToChangePassword": false,
        "wizardTracker": {
          "id": "bfcff706-e35c-4b39-8ba6-ea3ef440f83e",
          "createdAt": 1479478505059,
          "updatedAt": 1501941571939,
          "deletedAt": null,
          "addStaff": true,
          "emailSettings": true,
          "rates": true,
          "companySettings": true,
          "setupClient": true
        },
        "jobType": null,
        "userTOTP": {
          "id": "92570c4b-f940-4972-b443-a118c950c18c",
          "confirmed": false
        },
        "accountType": "TECH",
        "portalAccessStatus": null,
        "customerCompaniesInfo": [],
        "permissions": null,
        "myTicketUpdated": null,
        "adminAccess": false,
        "biometricEnabled": false,
        "owner": true,
        "default": false,
        "emailVerified": false,
        "contact": true
      },
      "number": "1516698",
      "date": 1556131829827,
      "dueDate": 1558723829827,
      "paidOn": null,
      "productsSum": 555.00,
      "servicesSum": 0.00,
      "discountSum": 0.00,
      "taxSum": 55.50,
      "totalSum": 610.50,
      "hasTaxRates": false,
      "termsAndConditions": "Reprehenderit qui ipsa rerum. Eum nemo voluptas blanditiis ea est et laboriosam perspiciatis. Dolore amet quaerat laborum non est ea et consectetur. Praesentium atque quisquam maxime eum rerum sint. Fuga et debitis inventore placeat nesciunt magnam.wefwfwfwfwfw3",
      "hasDiscount": false,
      "invoiceDiscount": null,
      "readAt": 1556194656411,
      "hasShippingAddress": false,
      "status": "DELETED",
      "note": null,
      "tickets": []
    };
    expect(com.getSubTotalWithDiscount()).toEqual(555);
    expect(com.getSubTotal()).toEqual(555);
    expect(com.getTotalDiscount()).toEqual(0);
  });
});