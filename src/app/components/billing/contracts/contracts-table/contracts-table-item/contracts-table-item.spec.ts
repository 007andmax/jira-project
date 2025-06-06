import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContractItem } from '../../class/contract-item';
import { ContractsTableItemComponent } from './contracts-table-item.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';



describe('ContractsTableItemComponent unit test', () => {
  let component: ContractsTableItemComponent;
  let fixture: ComponentFixture<ContractsTableItemComponent>;

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
        NoopAnimationsModule],
      declarations: [ContractsTableItemComponent
      ],
    }).compileComponents();

  });

  it('check "getType"', () => {
    const fixture = TestBed.createComponent(ContractsTableItemComponent);
    const com = fixture.debugElement.componentInstance;
    com.contract = new ContractItem(
      {
        "id": "153a8c11-4ebe-4ddc-8dbc-7bb15f1eeaf7",
        "description": "wefewfwef",
        "type": "HOURLY",
        "status": "CURRENT",
        "billType": null,
        "includedHours": null,
        "company": {
          "id": "32457670-d947-4de6-ab86-0731bdf02f70",
          "quoteExpirationDate": null
        },
        "reviewDate": "2026/02/04",
        "amount": 0.00,
        "startDate": "2025/02/04",
        "endDate": "2035/02/04",
        "interval": null,
        "customInterval": null,
        "manualCreateBillableItem": false,
        "enableInvoiceAutoCreate": false
      }
    )
    expect(com.getType()).toEqual("Custom Hourly");
  });
});