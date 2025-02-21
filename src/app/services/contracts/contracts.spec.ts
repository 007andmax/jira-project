import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ContractsService } from './contracts.service';
import { ToastrModule } from 'ngx-toastr';
import { ContractItem } from 'src/app/components/billing/contracts/class/contract-item';

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
        })
      ],
      providers: [ContractsService]
    });

    // Use TestBed.get() instead of TestBed.inject()
    service = TestBed.get(ContractsService);
    httpMock = TestBed.get(HttpTestingController);
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
  // Example test: GET request
  /* it('should fetch contracts (GET)', () => {
     const mockContracts = [
       new ContractItem({ id: "1", description: 'Contract A' }),
       new ContractItem({ id: "2", description: 'Contract B' })
     ];
 
     // Call the service method
     service.getServiceAgreements().subscribe(contracts => {
       expect(contracts[0].id).toEqual("1");
     });
 
     // Expect a GET request to the correct URL
     const req = httpMock.expectOne('http://localhost:4200/serviceAgreements/filtered'); // Adjust URL if necessary
     expect(req.request.method).toBe('POST');
 
     // Respond with mock data
     req.flush(mockContracts);
   });
 
   // Example test: handle errors
   it('should handle an error response', () => {
     const errorMessage = 'Something went wrong';
 
     // Call the service method
     service.getServiceAgreements().subscribe(
       () => fail('should have failed with an error'),
       error => {
         expect(error.status).toBe(500);
       }
     );
 
     // Simulate a network error
     const req = httpMock.expectOne('http://localhost:4200/serviceAgreements/filtered');
     req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
   });*/
});
