import { TestBed } from '@angular/core/testing';
import { ContractsService } from './contracts.service';
import { ToastrModule } from 'ngx-toastr';
import { ContractItem } from 'src/app/components/billing/contracts/class/contract-item';
import { ServiceAgreement } from 'src/app/components/billing/contracts/class/service-agreement';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

// Describe the test suite
describe('ContractsService', () => {
  let service: ContractsService;
  let httpMock: HttpTestingController;

  // Set up the testing module before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule
      ],
      providers: [ContractsService]
    });

    // Use TestBed.inject() instead of TestBed.inject()
    service = TestBed.inject(ContractsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Verify no outstanding requests after each test
  afterEach(() => {
    httpMock.verify();
  });

  // Test: should create the service
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('check forceCreate', () => {
    const mockContracts = "";

    // Call the service method
    service.forceCreate("861e633e-5ef9-48fc-8a6d-bd9a74d5ad95").subscribe(contracts => {
      //  expect(contracts[0].id).toEqual("1");
    });

    // Expect a GET request to the correct URL
    const req = httpMock.expectOne('http://localhost:4200/serviceAgreements/forceCreate?id=861e633e-5ef9-48fc-8a6d-bd9a74d5ad95'); // Adjust URL if necessary
    expect(req.request.method).toBe('GET');

    // Respond with mock data
    req.flush(mockContracts);
  });
  it('check getStatistics', () => {
    const mockContracts = [{
      "description": "ewefwf",
      "interval": "MONTHLY",
      "companyName": "000081 v12 & 25th Dental",
      "type": "SERVICE_CONTRACT",
      "quantity": null,
      "quantityLeft": null,
      "quantityUsed": null,
      "otherQuantity": 0.0,
      "quantityExceeding": 0.0
    },];

    // Call the service method
    service.getStatistics().subscribe(contracts => {
      expect(contracts[0]).toEqual({
        "description": "ewefwf",
        "interval": "MONTHLY",
        "companyName": "000081 v12 & 25th Dental",
        "type": "SERVICE_CONTRACT",
        "quantity": null,
        "quantityLeft": null,
        "quantityUsed": null,
        "otherQuantity": 0.0,
        "quantityExceeding": 0.0
      },);
    });

    // Expect a GET request to the correct URL
    const req = httpMock.expectOne('http://localhost:4200/reports/serviceAgreements/currentIntervalStatistics'); // Adjust URL if necessary
    expect(req.request.method).toBe('GET');

    // Respond with mock data
    req.flush(mockContracts);
  });
  it('check delete', () => {
    const mockContracts = {};

    // Call the service method
    service.delete("861e633e-5ef9-48fc-8a6d-bd9a74d5ad95").subscribe(contracts => {
      expect(contracts).toEqual({});
    });

    // Expect a GET request to the correct URL
    const req = httpMock.expectOne('http://localhost:4200/serviceAgreements/861e633e-5ef9-48fc-8a6d-bd9a74d5ad95'); // Adjust URL if necessary
    expect(req.request.method).toBe('DELETE');

    // Respond with mock data
    req.flush(mockContracts);
  });
  it('check terminate', () => {
    const mockContracts = {};

    // Call the service method
    service.terminate("861e633e-5ef9-48fc-8a6d-bd9a74d5ad95").subscribe(contracts => {
      expect(contracts).toEqual({});
    });

    // Expect a GET request to the correct URL
    const req = httpMock.expectOne('http://localhost:4200/serviceAgreements/terminate/861e633e-5ef9-48fc-8a6d-bd9a74d5ad95'); // Adjust URL if necessary
    expect(req.request.method).toBe('PUT');

    // Respond with mock data
    req.flush(mockContracts);
  });
  it('check getServiceAgreement', () => {
    const mockContracts = new ServiceAgreement({
      "id": "fba28a5b-5cf8-41a0-b2d0-2dbadcc5248c",
      "description": "qwqqqqqw",
      "type": "HOURLY",
      "status": "CURRENT",
      "billType": null,
      "includedHours": null,
      "glNumber": null,
      "companyId": "9cbdcc4d-2007-4730-975e-015407a1b366",
      "companyName": "ClientName",
      "startDate": "2025/02/20",
      "endDate": "2035/02/20",
      "reviewDate": "2026/02/20",
      "amount": 0.00,
      "services": [
        {
          "id": "8fe22205-050c-4e27-9a85-6956eef09430",
          "name": "e-commerce",
          "rate": 151.13,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": null,
          "taxIds": [
            "8d321592-ffbd-487a-95c5-4789fa9a58c6"
          ],
          "subscriptionService": null,
          "discountAmount": null,
          "discountType": null,
          "discountSum": 0.0000,
          "parentDefaultServiceId": "ab5cd3e0-7db5-4417-a144-040318b946f7"
        },
        {
          "id": "23a096ee-ef47-472c-981a-c9849e7dec4a",
          "name": "new service V2 - 2025",
          "rate": 200.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": null,
          "taxIds": [
            "8d321592-ffbd-487a-95c5-4789fa9a58c6"
          ],
          "subscriptionService": null,
          "discountAmount": null,
          "discountType": null,
          "discountSum": 0.0000,
          "parentDefaultServiceId": "17088515-59c9-4523-aa8d-680628a9cb2f"
        },
        {
          "id": "c650d1a6-7ee8-4bf2-a185-d8b3c76f96bc",
          "name": "new test service3 something else1212",
          "rate": 125.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": 1.0,
          "taxIds": [
            "8d321592-ffbd-487a-95c5-4789fa9a58c6"
          ],
          "subscriptionService": null,
          "discountAmount": null,
          "discountType": null,
          "discountSum": 0.0000,
          "parentDefaultServiceId": "5226150d-1e89-4dc6-9b59-6653bba718f1"
        },
        {
          "id": "9bf9b628-e812-458b-8171-547847166d69",
          "name": "On site block time service 777",
          "rate": 5.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": null,
          "taxIds": [],
          "subscriptionService": null,
          "discountAmount": null,
          "discountType": null,
          "discountSum": 0.0000,
          "parentDefaultServiceId": "00ab18a3-a21d-4b67-899e-72a8092fa831"
        },
        {
          "id": "cc0a613e-a7ea-4875-b297-4cb05d622495",
          "name": "Remote block time service",
          "rate": 5.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": null,
          "taxIds": [],
          "subscriptionService": null,
          "discountAmount": null,
          "discountType": null,
          "discountSum": 0.0000,
          "parentDefaultServiceId": "a3942a8a-b347-4c7b-bfee-d1a137947455"
        },
        {
          "id": "51b894eb-8eee-44a8-b76e-a42969c3011d",
          "name": "test 123 & 456",
          "rate": 111.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": null,
          "taxIds": [
            "8d321592-ffbd-487a-95c5-4789fa9a58c6"
          ],
          "subscriptionService": null,
          "discountAmount": null,
          "discountType": null,
          "discountSum": 0.0000,
          "parentDefaultServiceId": "8580ca83-f72d-4675-9145-b7ce74747f0c"
        },
        {
          "id": "1a2df76c-c439-4ea4-8f31-1c1f51ffdf16",
          "name": "test 2",
          "rate": 11.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": null,
          "taxIds": [
            "2893389a-b096-4aa0-a564-a8a474d01a85"
          ],
          "subscriptionService": null,
          "discountAmount": null,
          "discountType": null,
          "discountSum": 0.0000,
          "parentDefaultServiceId": "612d8ca3-fdf0-4045-90d3-e6b99107a5b2"
        },
        {
          "id": "0bd986b1-d949-4fcb-920f-a30ac984eb63",
          "name": "test service",
          "rate": 3.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": null,
          "taxIds": [
            "8d321592-ffbd-487a-95c5-4789fa9a58c6"
          ],
          "subscriptionService": null,
          "discountAmount": null,
          "discountType": null,
          "discountSum": 0.0000,
          "parentDefaultServiceId": "e0f1da07-fea0-4b97-913f-06223ab2193d"
        },
        {
          "id": "f3bc6842-a932-45b5-8891-651369b22c39",
          "name": "tyyt",
          "rate": 11.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": 1.0,
          "taxIds": [
            "8d321592-ffbd-487a-95c5-4789fa9a58c6"
          ],
          "subscriptionService": null,
          "discountAmount": null,
          "discountType": null,
          "discountSum": 0.0000,
          "parentDefaultServiceId": "7621dc4c-2023-4430-8c93-3cd4f7c6d86d"
        },
        {
          "id": "b3f41bef-fbe5-47bb-b6e5-179b9e180310",
          "name": "uie8gyer98gyer p98gyer g9y e8py ee8gy reyg reiyg yeruigregr euigyeiue eiug eiug eiugeigergergergerg",
          "rate": 33.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": null,
          "taxIds": [
            "8d321592-ffbd-487a-95c5-4789fa9a58c6"
          ],
          "subscriptionService": null,
          "discountAmount": null,
          "discountType": null,
          "discountSum": 0.0000,
          "parentDefaultServiceId": "92c284f4-c5b4-458f-8c72-0f55a3f3fc48"
        },
        {
          "id": "9ab6b5b2-c440-4244-a22c-813b70d6b0c7",
          "name": "Ukraine",
          "rate": 120.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": 7.0,
          "taxIds": [],
          "subscriptionService": null,
          "discountAmount": null,
          "discountType": null,
          "discountSum": 0.0000,
          "parentDefaultServiceId": "57ec26ed-6082-4f71-8613-837585c16852"
        },
        {
          "id": "05b26a8e-04a3-4e67-af8e-09409038bb72",
          "name": "65utyut",
          "rate": 34.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": 22.0,
          "taxIds": [],
          "subscriptionService": null,
          "discountAmount": null,
          "discountType": null,
          "discountSum": 0.0000,
          "parentDefaultServiceId": "3679accf-e6ae-46e0-9565-5c09e79e99d7"
        },
        {
          "id": "9531a847-d5ce-4d21-96f1-1b4b2c855c08",
          "name": "e-services",
          "rate": 883.68,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": null,
          "taxIds": [
            "8d321592-ffbd-487a-95c5-4789fa9a58c6"
          ],
          "subscriptionService": null,
          "discountAmount": null,
          "discountType": null,
          "discountSum": 0.0000,
          "parentDefaultServiceId": "3f732362-e5c5-4dbe-8ff8-2323214b874b"
        },
        {
          "id": "89a28f36-ac83-4111-a23d-808cacb4b571",
          "name": "efwefwefwfwef",
          "rate": 11.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": null,
          "taxIds": [
            "fcfdcfbf-3902-4339-8d9d-899c9752c60c",
            "8d321592-ffbd-487a-95c5-4789fa9a58c6"
          ],
          "subscriptionService": null,
          "discountAmount": null,
          "discountType": null,
          "discountSum": 0.0000,
          "parentDefaultServiceId": "f0e88111-c8a9-4a71-8cc8-64d58e6b3ee9"
        },
        {
          "id": "51bbaeef-b59c-45e8-8cf6-37a1327cf46a",
          "name": "infrastructures",
          "rate": 316.4,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": null,
          "taxIds": [
            "e35b6e4c-6961-4ef5-b5ff-2a4a0ea17df7"
          ],
          "subscriptionService": null,
          "discountAmount": null,
          "discountType": null,
          "discountSum": 0.0000,
          "parentDefaultServiceId": "7d9c2ad5-704d-4991-9fb9-0b720e5c1cc7"
        },
        {
          "id": "48470938-0fcb-4ff6-828e-d48ae0eb5d2c",
          "name": "Managed servers",
          "rate": 50.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": null,
          "taxIds": [
            "fcfdcfbf-3902-4339-8d9d-899c9752c60c",
            "8d321592-ffbd-487a-95c5-4789fa9a58c6"
          ],
          "subscriptionService": null,
          "discountAmount": null,
          "discountType": null,
          "discountSum": 0.0000,
          "parentDefaultServiceId": "2803b691-ef97-4901-af4d-f3ecbfd0ef81"
        },
        {
          "id": "8fe3f86f-5a0c-437d-9742-d2c41ec02405",
          "name": "On site service",
          "rate": 110.0,
          "count": null,
          "billable": true,
          "basedOnDefault": true,
          "commissionRate": 11.0,
          "taxIds": [
            "dd6f1583-10ad-4167-a62f-fe58a997c5c8"
          ],
          "subscriptionService": null,
          "discountAmount": null,
          "discountType": null,
          "discountSum": 0.0000,
          "parentDefaultServiceId": "0de481be-b965-47e6-bc7e-f5a205456c2d"
        }
      ],
      "blockTimeServices": [],
      "interval": null,
      "customInterval": null,
      "blockRate": null,
      "rateExceeding": null,
      "enableTimeRollover": false,
      "maxRolloverHours": null,
      "shares": [],
      "taxIds": [],
      "serviceContractServices": [],
      "serviceContractServicesToTrack": [],
      "serviceExpenses": [],
      "productExpenses": [],
      "invoiceAsSingleItem": false,
      "manualCreateBillableItem": false,
      "enableInvoiceAutoCreate": false,
      "taxSum": 0.00
    });

    // Call the service method
    service.getServiceAgreement("fba28a5b-5cf8-41a0-b2d0-2dbadcc5248c").subscribe(contracts => {
      expect(contracts.type).toEqual("HOURLY");
    });

    // Expect a GET request to the correct URL
    const req = httpMock.expectOne('http://localhost:4200/serviceAgreements/fba28a5b-5cf8-41a0-b2d0-2dbadcc5248c'); // Adjust URL if necessary
    expect(req.request.method).toBe('GET');

    // Respond with mock data
    req.flush(mockContracts);
  });
  it('check createContract', () => {
    const mockContracts = {
      "id": "f9cadce4-1663-4ba3-ba20-47f989f48f4c",
      "description": "eeeee",
      "type": "HOURLY",
      "status": "CURRENT",
      "billType": null,
      "includedHours": null,
      "companyId": "4a6f8299-67b2-4f52-814e-2aabf0e3362a",
      "companyName": "American Airlines",
      "startDate": "2025/02/23",
      "endDate": "2035/02/23",
      "reviewDate": "2026/02/23",
      "amount": 0,
      "interval": null,
      "customInterval": null,
      "manualCreateBillableItem": false,
      "enableInvoiceAutoCreate": false,
      "taxSum": 0
    };
    const payload = { "companyId": "4a6f8299-67b2-4f52-814e-2aabf0e3362a", "description": "eeeee", "endDate": "2035/02/23", "services": [{ "parentDefaultServiceId": "3679accf-e6ae-46e0-9565-5c09e79e99d7", "basedOnDefault": true, "billable": false, "commissionRate": 22, "rate": 0, "taxIds": [] }], "startDate": "2025/02/23", "reviewDate": "2026/02/23", "type": "HOURLY" };
    // Call the service method
    service.createContract(false, payload).subscribe((contracts: any) => {
      expect(contracts.id).toEqual("f9cadce4-1663-4ba3-ba20-47f989f48f4c");
    });

    // Expect a GET request to the correct URL
    const req = httpMock.expectOne('http://localhost:4200/serviceAgreements?createBillableItem=false'); // Adjust URL if necessary
    expect(req.request.method).toBe('POST');

    // Respond with mock data
    req.flush(mockContracts);
  });
  it('check getIntervals', () => {
    const mockContracts = { "0": { "endDate": 1742335200000, "startDate": 1739916000000 } };
    // Call the service method
    service.getIntervals("06967cdb-e982-4ccb-bb39-a674c0580823").subscribe((contracts: any) => {
      expect(contracts["0"].endDate).toEqual(1742335200000);
    });

    // Expect a GET request to the correct URL
    const req = httpMock.expectOne('http://localhost:4200/reports/serviceAgreements/intervals/06967cdb-e982-4ccb-bb39-a674c0580823'); // Adjust URL if necessary
    expect(req.request.method).toBe('GET');

    // Respond with mock data
    req.flush(mockContracts);
  });
  it('check updateContract', () => {
    const mockContracts = {
      "id": "861e633e-5ef9-48fc-8a6d-bd9a74d5ad95",
      "description": "wefewfew",
      "type": "SERVICE_CONTRACT",
      "status": "CURRENT",
      "billType": "DEVICE",
      "includedHours": null,
      "companyId": "e3943406-4072-4fa6-af60-e821ab60a27d",
      "companyName": "000081 v12 & 25th Dental",
      "startDate": "2025/02/19",
      "endDate": "2075/02/18",
      "reviewDate": "2026/02/19",
      "amount": 111.0000,
      "interval": "MONTHLY",
      "customInterval": null,
      "manualCreateBillableItem": false,
      "enableInvoiceAutoCreate": false,
      "taxSum": 0
    };
    const payload = { "id": "861e633e-5ef9-48fc-8a6d-bd9a74d5ad95", "billType": "DEVICE", "blockTimeServices": null, "companyId": "e3943406-4072-4fa6-af60-e821ab60a27d", "contractWithBlockTime": false, "customInterval": null, "description": "wefewfew", "endDate": "2075/02/18", "invoiceAsSingleItem": false, "includedHours": null, "interval": "MONTHLY", "rateExceeding": null, "serviceExpenses": null, "productExpenses": null, "serviceContractServices": [{ "count": 1, "rate": 111, "taxIds": [], "subscriptionService": { "id": "9c9df4b3-ccc1-410b-be15-ef6e4ee81b57" }, "id": "9b4e708e-36ff-4f61-810f-be6ec22dd51d" }], "serviceContractServicesToTrack": [{ "basedOnDefault": true, "rate": 0, "billable": false, "taxIds": [], "id": "095a2b66-899e-420a-96f1-dce9f3ce9b50", "parentDefaultServiceId": "1ffc56fc-5193-4924-ae11-090973444cf6" }], "services": [{ "basedOnDefault": true, "billable": true, "commissionRate": 44, "rate": 101, "taxIds": ["c56f4316-4bad-4155-93d3-52f841eae15b", "8d321592-ffbd-487a-95c5-4789fa9a58c6"], "discountAmount": 10, "discountType": "PERCENT", "id": "d68ebcf0-606f-49af-8fa7-61ba8f888f3e", "parentDefaultServiceId": "9ce617fa-32e8-426c-9fdd-5391426f8392" }, { "basedOnDefault": true, "billable": true, "commissionRate": null, "rate": 151.13, "taxIds": ["8d321592-ffbd-487a-95c5-4789fa9a58c6"], "id": "6a7a7865-41e9-4f48-9c0a-4756e60e5a89", "parentDefaultServiceId": "ab5cd3e0-7db5-4417-a144-040318b946f7" }], "reviewDate": "2026/02/19", "startDate": "2025/02/19", "taxIds": null, "type": "SERVICE_CONTRACT", "manualCreateBillableItem": false, "enableInvoiceAutoCreate": false };
    // Call the service method
    service.updateContract(payload).subscribe((contracts: any) => {
      expect(contracts.id).toEqual("861e633e-5ef9-48fc-8a6d-bd9a74d5ad95");
    });

    // Expect a GET request to the correct URL
    const req = httpMock.expectOne('http://localhost:4200/serviceAgreements'); // Adjust URL if necessary
    expect(req.request.method).toBe('PUT');

    // Respond with mock data
    req.flush(mockContracts);
  });
  it('check validateCrossingDatesHourly', () => {
    const mockContracts = { "valid": true };
    // Call the service method
    service.validateCrossingDatesHourly("18%20Feb%202025", "18%20Feb%202035", "ee388e1a-5baf-4c3f-9f94-f23153541610", "9049a437-82fd-456a-8673-6dc135793656").subscribe((contracts: any) => {
      expect(contracts.valid).toEqual(true);
    });

    // Expect a GET request to the correct URL
    const req = httpMock.expectOne('http://localhost:4200/serviceAgreements/validateCrossingDates?companyId=ee388e1a-5baf-4c3f-9f94-f23153541610&startDate=18%20Feb%202025&endDate=18%20Feb%202035&agreementId=9049a437-82fd-456a-8673-6dc135793656'); // Adjust URL if necessary
    expect(req.request.method).toBe('GET');

    // Respond with mock data
    req.flush(mockContracts);
  });
  it('check getServiceAgreements', () => {
    const mockContracts = [{
      "id": "06967cdb-e982-4ccb-bb39-a674c0580823",
      "description": "wefwf",
      "type": "BLOCK_TIME",
      "status": "TERMINATED",
      "billType": null,
      "includedHours": 3.0,
      "companyId": "d9e7af3a-c456-4d0b-aa5b-1b40dc60cf1f",
      "companyName": "Agent Test second round v3",
      "startDate": "2025/02/19",
      "endDate": "2075/02/19",
      "reviewDate": "2026/02/19",
      "amount": 9.00,
      "interval": "MONTHLY",
      "customInterval": null,
      "manualCreateBillableItem": false,
      "enableInvoiceAutoCreate": false,
      "taxSum": null
    },];
    // Call the service method
    service.getServiceAgreements({ test: "mull" }).subscribe((contracts: any) => {
      expect(contracts[0].id).toEqual("06967cdb-e982-4ccb-bb39-a674c0580823");
    });

    // Expect a GET request to the correct URL
    const req = httpMock.expectOne('http://localhost:4200/serviceAgreements/filtered'); // Adjust URL if necessary
    expect(req.request.method).toBe('POST');

    // Respond with mock data
    req.flush(mockContracts);
  });
});
