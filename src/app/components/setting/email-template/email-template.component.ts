import { Component, OnInit, ViewChild, ElementRef, OnDestroy, TemplateRef } from "@angular/core";
import { EmailTempleteService } from "./email-template.service";
import { map, catchError } from "rxjs/operators";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { of } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingStateService } from "src/app/states/setting/setting-state.service";
import { EmailTemplateStateService } from "src/app/states/email-template/email-template-state.service";

declare var $: any;

@Component({
  selector: "app-email-template",
  templateUrl: "./email-template.component.html",
  styleUrls: ["./email-template.component.scss"]
})
export class EmailTempleteComponent implements OnInit, OnDestroy {
  loading = true;
  submitted = false;
  edit = false;
  ticketTemplates: any;
  agentTemplates: any;
  invoiceTemplates: any;
  userTemplates: any;
  currentOpenTemplate = "";
  keywords: any[];
  templeteInfo: any;
  emailPreviewHtml: any;
  gettingEmailTemplatePreview: boolean;
  type = '';
  emailPages: any;
  elEditor: any = "";
  templeteForm: FormGroup;
  openEmailTemplate: string;
  public show = false;
  public buttonName: any = "Show Description";
  templatesData = { subject: {}, body: {} };
  @ViewChild("body") body: ElementRef;
  @ViewChild("subject") subject: ElementRef;

  constructor(
    private modalService: NgbModal,
    private emailService: EmailTempleteService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private settingStateService: SettingStateService,
    private emailTemplateStateService: EmailTemplateStateService,
    private sanitized: DomSanitizer,
  ) {
    this.ticketTemplates = this.emailService.getTicketTemplates();
    this.agentTemplates = this.emailService.getAgentTemplates();
    this.invoiceTemplates = this.emailService.getInvoiceTemplates();
    this.userTemplates = this.emailService.getUserTemplates();
  }

  ngOnInit() {
    $('body').addClass('page-settings');
    $('body').removeClass('backMenu');
    this.keywords = [];
    this.templeteForm = this.formBuilder.group({
      subject: ["", Validators.required],
      body: [""]
    });
    this.getEmailPages();
    this.settingStateService.setComponentName('EmailTempleteComponent');
    this.emailTemplateStateService.onChangeEmailTemplates.subscribe(data => {
      if (data.action == "COMPANY_EMAIL_NOTIFICATION") {
        for (const key in this.ticketTemplates) {
          if (data.data[key]) {
            this.emailPages.activeAndNotDefault[key] = data.data[key];
            break;
          }
        }
        for (const key in this.agentTemplates) {
          if (data.data[key]) {
            this.emailPages.activeAndNotDefault[key] = data.data[key];
            break;
          }
        }
        for (const key in this.invoiceTemplates) {
          if (data.data[key]) {
            this.emailPages.activeAndNotDefault[key] = data.data[key];
            break;
          }
        }
        for (const key in this.userTemplates) {
          if (data.data[key]) {
            this.emailPages.activeAndNotDefault[key] = data.data[key];
            break;
          }
        }
      }

    })
  }

  ngOnDestroy() {
    $('body').removeClass('page-settings');
  }

  onBackMenu() {
    let body = document.getElementsByTagName("body")[0];
    body.classList.remove("backMenu"); //remove the class
    body.classList.add("backMenu");
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.templeteForm.controls;
  }

  onReady(eventData) {
    eventData.plugins.get("FileRepository").createUploadAdapter = function (
      loader
    ) {
      return new UploadAdapter(loader);
    };
  }

  /**
   * email pages
   */
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
          return of("");
        })
      )
      .subscribe();
  }

  /**
   * get templates
   * @param templete
   * @param index
   */
  getTemplate(templete, index) {
    if (!templete) {
      return;
    }
    this.templeteInfo = { ...templete.value, key: templete.key };
    this.edit = true;
    this.emailService
      .getTemplate(templete.key)
      .pipe(
        map((res: any) => {
          if (res) {
            this.hideButtonTextEditor();
            this.templatesData.body = res.body;
            this.templatesData.subject = res.subject;
            this.keywords = res.keywords;
            this.type = res.type

            this.templeteForm.controls["subject"].clearValidators();

            if (this.templeteInfo.requiredKeywordsRegExp) {
              const pattern = this.templeteInfo.requiredKeywordsRegExp;
              this.templeteForm.controls["subject"].setValidators([
                Validators.required,
                Validators.pattern(pattern)
              ]);
              this.templeteForm.controls["subject"].updateValueAndValidity();
            } else {
              this.templeteForm.controls["subject"].setValidators([
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

  /**
   * inset caret based on text
   * @param text
   */
  insertAtCaret(text) {
    var el = document.activeElement;

    if (el.id === "subject") {
      var startPos = this.subject.nativeElement.selectionStart;

      this.subject.nativeElement.value =
        this.subject.nativeElement.value.substr(
          0,
          this.subject.nativeElement.selectionStart
        ) +
        text +
        this.subject.nativeElement.value.substr(
          this.subject.nativeElement.selectionStart,
          this.subject.nativeElement.value.length
        );

      this.templeteForm.patchValue({
        subject: this.subject.nativeElement.value
      });

      this.subject.nativeElement.selectionStart = startPos;
      this.subject.nativeElement.focus();
      $("#elem").selectRange(3);
    } else {
      this.insertAt(document.getElementById("myEditor"), text);
    }
  }

  /**
   * insert data varables based on params
   * @param myField
   * @param myValue
   */
  insertDataVarables(myField, myValue) {
    var sel, range;
    sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      myField.rango = sel.getRangeAt(0);
      myField.rango.insertNode(document.createTextNode(myValue));
      myField.autofocus = true;

      this.templeteForm.patchValue({
        body: myField.textContent
      });

      return false;
    }
  }

  insertAt(element, text) {
    if (document['selection']) {
      element.focus();
      var sel = document['selection'].createRange();
      sel.text = text;
      element.focus();
    } else if (element.selectionStart || element.selectionStart === 0) {
      var startPos = element.selectionStart;
      var endPos = element.selectionEnd;
      var scrollTop = element.scrollTop;
      element.value = element.value.substring(0, startPos) +
        text + element.value.substring(endPos, element.value.length);
      element.focus();
      element.selectionStart = startPos + text.length;
      element.selectionEnd = startPos + text.length;
      element.scrollTop = scrollTop;
    } else {
      element.value += text;
      element.focus();
    }
  }

  emailPreview(template: TemplateRef<any>) {
    this.emailPreviewHtml = '';
    this.gettingEmailTemplatePreview = true;

    this.emailService
      .getHtmlForPreview(this.type, this.templatesData)
      .pipe(
        map(resp => {
          this.emailPreviewHtml = resp;
          this.emailPreviewHtml = this.emailPreviewHtml.replace(/font-family: Inter, sans-serif;/gi, '')
          this.emailPreviewHtml = this.sanitized.bypassSecurityTrustHtml(this.emailPreviewHtml);
          this.gettingEmailTemplatePreview = false;
          this.modalService.open(template, { ariaLabelledBy: 'modal-basic-title', windowClass: "manage-tags email-template-preview", centered: true, backdrop: 'static', keyboard: false }).result.then((result) => {

          }, (reason) => {

          });
        })
      )
      .subscribe();
  }



  /**
   * saved email template
   */
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
    }
    this.templeteForm.patchValue({
      body: (document.getElementById("myEditor")['value'].length == 0) ? null : document.getElementById("myEditor")['value'],
      subject: this.templeteForm.value.subject
    });
    this.emailService
      .saveEmailTemplate(this.templeteForm.value, this.openEmailTemplate)
      .subscribe(
        () => {
          this.closeTemplete();
        },
        error => {
          this.toastr.error(`Error Occured  ${error}`);
        }
      );
  }
  closeTemplete() {
    this.submitted = false;
    this.edit = false;
    this.templeteForm.reset();
    this.templeteInfo = null;
  }

  /**
   * retore default templated
   * @param templeteKey
   */
  restoreDefault(templeteKey) {
    if (!templeteKey) {
      return;
    }
    this.emailService
      .setToDefaultTemplete(templeteKey)
      .pipe(
        map((defaultTemplate: any) => {
          if (defaultTemplate) {
            this.templeteForm.patchValue({
              subject: defaultTemplate.subject,
              body: defaultTemplate.body
            });
          }
        })
      )
      .subscribe(
        () => {

        },
        error => {
          this.toastr.error(`Error Occured ${error}`);
        }
      );
  }

  toggle() {
    this.show = !this.show;

    if (this.show) {
      this.buttonName = "Hide Description";
    } else {
      this.buttonName = "Show Description";
    }
  }

  hideButtonTextEditor() {
    $("#toggleEditorMode-myEditor")
      .parent()
      .hide();
    $("#superscript-myEditor").hide();
    $("#subscript-myEditor").hide();
    $("#strikeThrough-myEditor").hide();
    $("#indent-myEditor")
      .parent()
      .hide();
    $("#insertUnorderedList-myEditor")
      .parent()
      .hide();
    $("#heading-myEditor")
      .parent()
      .hide();
    $("#fontSizeSelector-myEditor")
      .parent()
      .hide();
    $("#foregroundColorPicker-myEditor")
      .parent()
      .hide();
    $("#link-myEditor")
      .parent()
      .hide();
  }
}

export class UploadAdapter {
  private loader;
  constructor(loader: any) {
    this.loader = loader;
  }

  readThis(file: File): Promise<any> {
    return this.loader.file.then(
      file =>
        new Promise((resolve, reject) => {
          var myReader = new FileReader();
          myReader.onloadend = e => {
            resolve({ default: myReader.result });
          };

          myReader.readAsDataURL(file);
        })
    );
  }
}
