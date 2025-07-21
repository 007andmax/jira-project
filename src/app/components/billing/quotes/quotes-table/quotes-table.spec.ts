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
import { QuotesTableComponent } from './quotes-table.component';
import { Quote } from '../class/quote';


describe('QuotesTableComponent unit test', () => {
  let component: QuotesTableComponent;
  let fixture: ComponentFixture<QuotesTableComponent>;

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
        NoopAnimationsModule],
      declarations: [QuotesTableComponent
      ],
    }).compileComponents();

  });
  it('check "onSelectAllQuotes"', () => {
    const fixture = TestBed.createComponent(QuotesTableComponent);
    const com = fixture.debugElement.componentInstance;
    com.quotes = [new Quote({ selected: true, isOrder: true, status: 'UNREAD' }), new Quote({ selected: true, isOrder: false, status: 'SAVED' })];
    com.onSelectAllQuotes({ target: { checked: true } });
    expect(com.selectAll).toEqual(true);
    expect(com.quotes.some(item => item.selected == false)).toEqual(false);
  });
  it('check "setDefaultScoll"', () => {
    const fixture = TestBed.createComponent(QuotesTableComponent);
    const com = fixture.debugElement.componentInstance;
    com.page_number = 11;
    com.setDefaultScoll();
    expect(com.page_number).toEqual(0);
  });
  it('check "onSelected"', () => {
    const fixture = TestBed.createComponent(QuotesTableComponent);
    const com = fixture.debugElement.componentInstance;
    com.quotes = [{ id: 1, selected: false, isOrder: true, status: 'UNREAD', company: { addresses: [] } }, { id: 2, selected: false, isOrder: false, status: 'SAVED', company: { addresses: [] } }];
    com.onSelected({ id: 1, selected: true });
    expect(com.selectAll).toEqual(false);
  });
});