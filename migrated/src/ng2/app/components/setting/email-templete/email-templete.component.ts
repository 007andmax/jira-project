import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { EmailTempleteService } from './email-templete.service';
import { map, catchError } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { of } from 'rxjs';

@Component({
  selector: 'app-email-templete',
  templateUrl: './email-templete.component.html',
  styleUrls: ['./email-templete.component.scss']
})
export class EmailTempleteComponent implements OnInit {
  loading = false;
  submitted = false;
  edit = false;

  ticketTemplates: any;
  agentTemplates: any;
  invoiceTemplates: any;
  currentOpenTemplate = '';

  keywords: any[];
  templeteInfo: any;
  emailPreviewHtml: any;
  gettingEmailTemplatePreview: boolean;

  emailPages: any;
  templeteForm: FormGroup;
  templatesData = { subject: {}, body: {} };
  openEmailTemplate: string;
  modalRef: BsModalRef;
  @ViewChild('subject') subject: ElementRef;
  @ViewChild('body') body: ElementRef;
  public show = false;
  public buttonName: any = 'Show Keyword Description + ';

  constructor(
    private modalService: BsModalService,
    private emailService: EmailTempleteService,
    private formBuilder: FormBuilder
  ) {
    this.ticketTemplates = this.emailService.getTicketTemplates();
    this.agentTemplates = this.emailService.getAgentTemplates();
    this.invoiceTemplates = this.emailService.getInvoiceTemplates();
  }

  openModal(template) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'manage-tags modal-dialog-centered' })
    );
  }

  ngOnInit() {
    this.keywords = [];
    this.templeteForm = this.formBuilder.group({
      subject: ['', Validators.required],
      body: ['', Validators.required]
    });
    this.getEmailPages();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.templeteForm.controls;
  }

  getEmailPages() {
    this.loading = true;
    this.emailService
      .getEmailPages()
      .pipe(
        map(res => {
          this.loading = false;
          this.emailPages = res;
        }),
        catchError(err => {
          this.loading = false;
          return of('');
        })
      )
      .subscribe();
  }

  getTemplate(templete, index) {
    if (!templete) {
      return;
    }
    this.getEmailPages();
    this.templeteInfo = templete.value;
    this.loading = true;
    this.edit = true;
    this.emailService
      .getTemplate(templete.key)
      .pipe(
        map((res: any) => {
          this.loading = false;
          if (res) {
            this.templatesData.body = res.body;
            this.templatesData.subject = res.subject;
            this.keywords = res.keywords;

            this.templeteForm.controls['subject'].clearValidators();

            if (this.templeteInfo.requiredKeywordsRegExp) {
              const pattern = this.templeteInfo.requiredKeywordsRegExp;
              this.templeteForm.controls['subject'].setValidators([
                Validators.required,
                Validators.pattern(pattern)
              ]);
              this.templeteForm.controls['subject'].updateValueAndValidity();
            } else {
              this.templeteForm.controls['subject'].setValidators([
                Validators.required
              ]);
            }

            this.templeteForm.patchValue({
              subject: this.templatesData.subject,
              body: this.templatesData.body
            });
          }
          this.openEmailTemplate = templete.key;
        })
      )
      .subscribe();
  }

  trackByTicket(index, item) {
    return item.value.title;
  }

  insertAtCaret(text) {
    var el = document.activeElement;
    console.log(el);
    this.insertDataVarables(el, text);
  }

  insertDataVarables(myField, myValue) {
    if (myField.selectionStart || myField.selectionStart == '0') {
      var startPos = myField.selectionStart;
      var endPos = myField.selectionEnd;
      myField.value =
        myField.value.substring(0, startPos) +
        myValue +
        myField.value.substring(endPos, myField.value.length);
      myField.selectionStart = startPos + myValue.length;
      myField.selectionEnd = startPos + myValue.length;
      myField.focus();
    } else {
      myField.value += myValue;
    }
    if (myField.name === 'subject') {
      this.templeteForm.patchValue({
        subject: myField.value
      });
    } else if (myField.name === 'body') {
      this.templeteForm.patchValue({
        body: myField.value
      });
    }
  }

  emailPreview(templateKey) {
    this.emailPreviewHtml = undefined;
    this.gettingEmailTemplatePreview = true;

    this.emailService
      .getHtmlForPreview(templateKey, this.templatesData)
      .pipe(
        map(resp => {
          this.emailPreviewHtml = resp;
          this.gettingEmailTemplatePreview = false;
        })
      )
      .subscribe();
  }

  closeTemplete() {
    this.edit = false;
  }

  saveEmailTemplate() {
    this.edit = true;
    this.submitted = true;
    if (this.templeteForm.invalid) {
      return;
    }

    if (this.templeteInfo.requiredKeywordsRegExp) {
      const matches = this.templeteForm.value.subject.match(
        this.templeteInfo.requiredKeywordsRegExp
      );
      if (matches === null) {
      }
      // return matches && matches.length ? { invalid_characters: matches } : null;
    }

    this.loading = true;
    this.templeteForm.patchValue({
      body: this.body.nativeElement.value,
      subject: this.subject.nativeElement.value
    });

    this.emailService
      .saveEmailTemplate(this.templeteForm.value, this.openEmailTemplate)
      .pipe(
        map(res => {
          this.loading = false;
          this.submitted = false;
          this.edit = false;
          this.templeteForm.reset();
        })
      )
      .subscribe(() => {
        this.getEmailPages();
      });
  }

  restoreDefault(templeteKey) {
    if (!templeteKey) {
      return;
    }

    this.loading = true;
    this.emailService
      .setToDefaultTemplete(templeteKey)
      .pipe(
        map((defaultTemplate: any) => {
          this.loading = false;
          if (defaultTemplate) {
            this.templeteForm.patchValue({
              subject: defaultTemplate.subject,
              body: defaultTemplate.body
            });
          }
        })
      )
      .subscribe(() => {
        this.getEmailPages();
      });
  }

  toggle() {
    this.show = !this.show;

    if (this.show) {
      this.buttonName = 'Hide Keyword Description - ';
    } else {
      this.buttonName = 'Show Keyword Description + ';
    }
  }
}
