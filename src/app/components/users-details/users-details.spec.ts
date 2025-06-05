import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { UsersDetailsHeaderModule } from './users-details-header/users-details-header.module';
import { UsersDetailsLeftPanelModule } from './users-details-left-panel/users-details-left-panel.module';
import { UsersDetailsRoutingModule } from './users-details-routing.module';
import { UsersDetailsTabCompaniesModule } from './users-details-tab-companies/users-details-tab-companies.module';
import { UsersDetailsTabDocumentsModule } from './users-details-tab-documents/users-details-tab-documents.module';
import { UsersDetailsTabMessagesModule } from './users-details-tab-messages/users-details-tab-messages.module';
import { UsersDetailsTabPasswordsModule } from './users-details-tab-passwords/users-details-tab-passwords.module';
import { UsersDetailsTabTicketsModule } from './users-details-tab-tickets/users-details-tab-tickets.module';
import { UsersDetailsComponent } from './users-details.component';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
declare var jasmine;
const mockRouter = {
  navigate: jasmine.createSpy('navigate'),
  routerState: {
    root: {}
  },
  events: of(),
};


describe('UsersDetailsComponent unit test', () => {
  let component: UsersDetailsComponent;
  let fixture: ComponentFixture<UsersDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        UsersDetailsHeaderModule,
        UsersDetailsLeftPanelModule,
        UsersDetailsTabCompaniesModule,
        UsersDetailsTabDocumentsModule,
        UsersDetailsTabMessagesModule,
        UsersDetailsTabPasswordsModule,
        UsersDetailsTabTicketsModule,
        HttpClientModule,
        RouterTestingModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),
        NoopAnimationsModule],
      declarations: [UsersDetailsComponent
      ],
      providers: [{ provide: Router, useValue: mockRouter }],
    }).compileComponents();

  });

  it('check "setTab"', () => {
    const fixture = TestBed.createComponent(UsersDetailsComponent);
    const com = fixture.debugElement.componentInstance;
    com.setTab('tickets');
    expect(com.tab).toEqual('tickets');
  });

});