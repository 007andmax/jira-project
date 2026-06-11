import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NumberModule } from 'src/app/directives/number/number.module';
import { MatErrorModule } from 'src/app/components/shared/mat-error/mat-error.module';
import { InvoiceLock } from '../../class/invoice-lock';
import { InvoiceFormComponent } from './invoice-form.component';
import { InvoiceRegularNoteModule } from './invoice-regular-note/invoice-regular-note.module';


describe('InvoiceFormComponent unit test', () => {
  let component: InvoiceFormComponent;
  let fixture: ComponentFixture<InvoiceFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [CommonModule,
        NgbModule,
        FormsModule,
        MatErrorModule,
        InvoiceRegularNoteModule,
        HttpClientModule,
        ToastrModule.forRoot({
            closeButton: true,
            timeOut: 5000,
            onActivateTick: true
        }),
        NoopAnimationsModule, InvoiceFormComponent]
}).compileComponents();

  });

  /* it('check "onDeleteDiscount" & "onSetEditTickets" & "onCheckUpdateGlobalNote" & "onUpdateSubjectTicket" & "getSubTotalWithDiscount" & "getSubTotal" & "getTotalDiscount"', () => {
     const fixture = TestBed.createComponent(InvoiceFormComponent);
     const com = fixture.debugElement.componentInstance;
     com.invoice = new InvoiceLock({
       alreadyLockedTickets: [],
       invoiceDataDto: {
         "billTo": [
           {
             "id": "4129c26d-c71a-4f66-a2a7-c73e61cd1e5b",
             "address": "Zakaria Street, Kolutolla, Ward Number 44, Kolkata, West Bengal, India",
             "locationName": "shipping location name -  & 25th Dental",
             "sameAsBilling": false,
             "country": null,
             "longCity": null,
             "longState": null,
             "shortCity": null,
             "shortState": null,
             "postalCode": "4444",
             "suiteNumber": "33333",
             "countryCode": "IN",
             "locationLat": 22.5771521,
             "locationLng": 88.3581294,
             "isPrimary": false,
             "locale": "America/Denver",
             "phoneNumbers": [
               {
                 "id": "8ba08eb2-4d75-450f-af65-b7f9654d36aa",
                 "number": "(555) 555-5555 Ext: 5",
                 "typeNumber": "OFFICE",
                 "priority": 1
               }
             ],
             "timeZone": {
               "displayName": "Mountain Standard Time",
               "name": "America/Denver",
               "timeOffset": -21600000
             },
             "addressWithSuitNumberAndPostalCode": "33333, Zakaria Street, Kolutolla, Ward Number 44, Kolkata, West Bengal, India\n4444"
           },
           {
             "id": "62d4aee6-4e66-42d0-8d8f-9eafb518638f",
             "address": "F.C. Road, Shivajinagar, Pune, Maharashtra, India",
             "locationName": "billing location name -  & 25th Dental",
             "sameAsBilling": false,
             "country": null,
             "longCity": null,
             "longState": null,
             "shortCity": null,
             "shortState": null,
             "postalCode": "333311434",
             "suiteNumber": "22244433",
             "countryCode": "IN",
             "locationLat": 18.5236317,
             "locationLng": 73.84112259999999,
             "isPrimary": true,
             "locale": "America/Denver",
             "phoneNumbers": [
               {
                 "id": "f3cae62b-831a-457e-ba57-b494526d61d7",
                 "number": "(114) 443-1111 Ext: 114344",
                 "typeNumber": "OFFICE",
                 "priority": 1
               }
             ],
             "timeZone": {
               "displayName": "Mountain Standard Time",
               "name": "America/Denver",
               "timeOffset": -21600000
             },
             "addressWithSuitNumberAndPostalCode": "22244433, F.C. Road, Shivajinagar, Pune, Maharashtra, India\n333311434"
           }
         ],
         "shipTo": [
           {
             "id": "4129c26d-c71a-4f66-a2a7-c73e61cd1e5b",
             "address": "Zakaria Street, Kolutolla, Ward Number 44, Kolkata, West Bengal, India",
             "locationName": "shipping location name -  & 25th Dental",
             "sameAsBilling": false,
             "country": null,
             "longCity": null,
             "longState": null,
             "shortCity": null,
             "shortState": null,
             "postalCode": "4444",
             "suiteNumber": "33333",
             "countryCode": "IN",
             "locationLat": 22.5771521,
             "locationLng": 88.3581294,
             "isPrimary": false,
             "locale": "America/Denver",
             "phoneNumbers": [
               {
                 "id": "8ba08eb2-4d75-450f-af65-b7f9654d36aa",
                 "number": "(555) 555-5555 Ext: 5",
                 "typeNumber": "OFFICE",
                 "priority": 1
               }
             ],
             "timeZone": {
               "displayName": "Mountain Standard Time",
               "name": "America/Denver",
               "timeOffset": -21600000
             },
             "addressWithSuitNumberAndPostalCode": "33333, Zakaria Street, Kolutolla, Ward Number 44, Kolkata, West Bengal, India\n4444"
           },
           {
             "id": "62d4aee6-4e66-42d0-8d8f-9eafb518638f",
             "address": "F.C. Road, Shivajinagar, Pune, Maharashtra, India",
             "locationName": "billing location name -  & 25th Dental",
             "sameAsBilling": false,
             "country": null,
             "longCity": null,
             "longState": null,
             "shortCity": null,
             "shortState": null,
             "postalCode": "333311434",
             "suiteNumber": "22244433",
             "countryCode": "IN",
             "locationLat": 18.5236317,
             "locationLng": 73.84112259999999,
             "isPrimary": true,
             "locale": "America/Denver",
             "phoneNumbers": [
               {
                 "id": "f3cae62b-831a-457e-ba57-b494526d61d7",
                 "number": "(114) 443-1111 Ext: 114344",
                 "typeNumber": "OFFICE",
                 "priority": 1
               }
             ],
             "timeZone": {
               "displayName": "Mountain Standard Time",
               "name": "America/Denver",
               "timeOffset": -21600000
             },
             "addressWithSuitNumberAndPostalCode": "22244433, F.C. Road, Shivajinagar, Pune, Maharashtra, India\n333311434"
           }
         ],
         "company": {
           "id": "e3943406-4072-4fa6-af60-e821ab60a27d",
           "name": "000081 v12 & 25th Dental",
           "quoteExpirationDate": null
         },
         "companyName": "000081 v12 & 25th Dental",
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
         "billingAddress": "22244433, F.C. Road, Shivajinagar, Pune, Maharashtra, India\n333311434",
         "shippingAddress": "22244433, F.C. Road, Shivajinagar, Pune, Maharashtra, India\n333311434",
         "billingLocationName": null,
         "shippingLocationName": null,
         "senderAddress": "12, 3615 South Hope Street, , , USA\nLos Angeles, CA\n11111",
         "senderUser": {
           "id": "fdcc9775-2ec7-44cf-9990-57021adca14c",
           "company": {
             "id": "72381bff-127c-4a63-9d2e-6e952350dcbd",
             "name": "Active Information Systems2025 DEV",
             "quoteExpirationDate": 30
           },
           "firstName": "Maxim",
           "lastName": "Ivanov",
           "phoneNumbers": [],
           "status": null,
           "jobDescription": null,
           "primaryEmail": "007andmax@gmail.com",
           "secondaryEmail": null,
           "deletedAt": null,
           "role": null,
           "techRole": "Administrator21",
           "startPage": "MY_TICKETS",
           "userStatistic": {
             "id": "1559b517-07d2-4e5d-98dd-52df39be931d",
             "ticketsSubmitted": 0,
             "ticketsResolved": 68
           },
           "tags": [],
           "avatar": null,
           "online": true,
           "lockScreen": true,
           "isEmailVerified": true,
           "isContact": true,
           "userEnabled": true,
           "isDefault": false,
           "priority": 1,
           "subscription": null,
           "twoFactorAuthType": "DISABLED",
           "isOwner": false,
           "disabledWelcomeWizard": false,
           "requestToChangePassword": false,
           "wizardTracker": null,
           "jobType": null,
           "userTOTP": {
             "id": "25c5990b-8db8-43e0-bfe6-419de11c8947",
             "confirmed": false
           },
           "accountType": "TECH",
           "portalAccessStatus": null,
           "customerCompaniesInfo": [],
           "permissions": null,
           "myTicketUpdated": null,
           "adminAccess": false,
           "biometricEnabled": false,
           "owner": false,
           "default": false,
           "emailVerified": true,
           "contact": true
         },
         "number": "15613",
         "date": 1751633427921,
         "dueDate": 1752238227921,
         "paidOn": null,
         "productsSum": 0,
         "servicesSum": 3190.0000,
         "discountSum": 20.0000,
         "taxSum": 318.0000,
         "totalSum": 3498.0000,
         "hasTaxRates": false,
         "termsAndConditions": "Reprehenderit qui ipsa rerum. Eum nemo voluptas blanditiis ea est et laboriosam perspiciatis. Dolore amet quaerat laborum non est ea et consectetur. Praesentium atque quisquam maxime eum rerum sint. Fuga et debitis inventore placeat nesciunt magnam.wefwfwfwfwfw3",
         "hasDiscount": true,
         "invoiceDiscount": null,
         "readAt": null,
         "hasShippingAddress": false,
         "status": null,
         "note": null,
         "tickets": [
           {
             "id": "eaea5ff4-0e57-48e6-b56a-adc61f81e42e",
             "number": "15542",
             "subject": "wefwfewf",
             "note": null,
             "closedAt": 1750240576654,
             "productExpenses": [],
             "serviceExpenses": [
               {
                 "id": "7145f211-590f-403b-bb37-cd9e525055fa",
                 "createdAt": 1750240576976,
                 "updatedAt": 1750240576976,
                 "deletedAt": null,
                 "ticketUpdate": {
                   "id": "d1914f65-f782-406e-979d-f8b592b69e74",
                   "unread": false,
                   "notifyTicketCreator": false,
                   "attachFileIds": [],
                   "performerEmail": null
                 },
                 "user": null,
                 "completed": false,
                 "date": 1750240576943,
                 "serviceAgreementIdForOtherContracts": null,
                 "discountAmount": 10.0000,
                 "discountType": "PERCENT",
                 "sum": 3190.0000,
                 "discountSum": 20.0000,
                 "taxSum": 318.0000,
                 "totalSum": 3498.0000,
                 "quantity": 1.0,
                 "billableQuantity": 1.0,
                 "commissionRate": 13.0,
                 "description": "Managed Service Contract",
                 "itemOrder": 0,
                 "isServiceExpense": true,
                 "glNumber": {
                   "id": "9fe4ad40-5b32-42ba-a68a-62cf1a012863",
                   "glNumber": "1test 4 53 3e3e3 dsf",
                   "description": "cvxcv",
                   "archivedAt": 1656594327498
                 },
                 "item": {
                   "versionedId": {
                     "id": "1af69f90-ab5d-4806-b68c-10821641eddf",
                     "version": 0
                   },
                   "createdAt": 1750240576939,
                   "updatedAt": null,
                   "deletedAt": 1751452808106,
                   "name": "Service Contract",
                   "rate": 3190.00,
                   "commissionRate": 13.0,
                   "discountAmount": null,
                   "discountType": null,
                   "discountSum": 0.0000,
                   "billable": true,
                   "isDefault": false,
                   "isBasedOnDefault": false,
                   "parentDefaultServiceId": null,
                   "company": {
                     "id": "e3943406-4072-4fa6-af60-e821ab60a27d",
                     "name": "000081 v12 & 25th Dental",
                     "quoteExpirationDate": null
                   },
                   "parentSubscriptionService": null,
                   "serviceAgreement": null,
                   "blockTimeServiceAgreement": null,
                   "serviceContractServiceAgreement": {
                     "id": "ab0f6030-d2df-4e80-9dfb-06c0487f85c7",
                     "taxSum": 318.00,
                     "manualCreateBillableItem": false,
                     "enableInvoiceAutoCreate": false,
                     "perpetual": false
                   },
                   "originService": null,
                   "taxes": [],
                   "glNumber": null,
                   "isStub": true,
                   "canUseInTicket": false,
                   "isServiceToTrack": false,
                   "oldVersion": false
                 },
                 "taxes": [
                   {
                     "id": "b28b9b39-78e9-47bf-a9d5-3ba92ca31e88",
                     "createdAt": 1750240576977,
                     "updatedAt": 1750240576977,
                     "deletedAt": null,
                     "name": "Ngultrum",
                     "rate": 10.00,
                     "isDefault": false,
                     "taxSum": null
                   }
                 ],
                 "durationStart": null,
                 "durationEnd": null,
                 "billable": true,
                 "itemCompany": {
                   "id": "e3943406-4072-4fa6-af60-e821ab60a27d",
                   "name": "000081 v12 & 25th Dental",
                   "quoteExpirationDate": null
                 },
                 "price": 3190,
                 "serviceExpense": true,
                 "editedExpense": false,
                 "isServiceContractSingleItem": true
               }
             ],
             "productsSum": 0,
             "servicesSum": 3190.0000,
             "discountSum": 20.0000,
             "taxSum": 318.0000,
             "totalSum": 3498.0000
           }
         ]
       },
       lockId: "text",
       lockedTickets: [],
       includeAccountReceivableReportAsAttachmentSetting: true
     })
     com.onDeleteDiscount(com.invoice);
     expect(com.toggleDiscount).toEqual(false);
     com.onSetEditTickets();
     expect(com.editTickets[0].id).toEqual("eaea5ff4-0e57-48e6-b56a-adc61f81e42e");
     com.onCheckUpdateGlobalNote();
     expect(com.changeGlobalNote).toEqual(true);
     com.onUpdateSubjectTicket("test", 0);
     expect(com.invoice.invoiceDataDto.tickets[0].subject).toEqual("test");
     expect(com.getSubTotalWithDiscount()).toEqual(3170);
     expect(com.getSubTotal()).toEqual(3190);
     expect(com.getTotalDiscount()).toEqual(20);
   });*/
  it('check "getDuration"', () => {
    const fixture = TestBed.createComponent(InvoiceFormComponent);
    const com = fixture.debugElement.componentInstance;
    expect(com.getDuration(2)).toEqual("02:00 hr(s)");
  });
});