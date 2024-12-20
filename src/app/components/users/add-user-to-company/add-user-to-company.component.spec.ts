import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserToCompanyComponent } from './add-user-to-company.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgbActiveModal, NgbModal, NgbModalConfig, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DisabledBtnModule } from 'src/app/directives/disabled-btn/disabled-btn.module';
import { PreloaderTicketModule } from '../../shared/preloader-ticket/preloader-ticket.module';
import { AddUserToCompanyItemComponent } from './add-user-to-company-item/add-user-to-company-item.component';
import { AddUserToCompanySelectedItemComponent } from './add-user-to-company-selected-item/add-user-to-company-selected-item.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserListService } from '../services/user-list.service';
import { ToastrModule } from 'ngx-toastr';

describe('AddUserToCompanyComponent', () => {
  let component: AddUserToCompanyComponent;
  let fixture: ComponentFixture<AddUserToCompanyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule,
        FormsModule,
        InfiniteScrollModule,
        NgbModule,
        DisabledBtnModule,
        PreloaderTicketModule,
        HttpClientModule,
        ToastrModule.forRoot({
          closeButton: true,
          timeOut: 5000,
          onActivateTick: true
        }),],
      providers: [UserListService, NgbModalConfig, NgbModal, NgbActiveModal],
      declarations: [AddUserToCompanyComponent,
        AddUserToCompanyItemComponent,
        AddUserToCompanySelectedItemComponent
      ],
    })
    fixture = TestBed.createComponent(AddUserToCompanyComponent);
    component = fixture.componentInstance;
  });

  it('should contain "banner works!"', () => {
    const bannerElement: HTMLElement = fixture.nativeElement;
    expect(bannerElement.querySelector(".user-company-header h3").textContent).toContain('Add User');
  });
});