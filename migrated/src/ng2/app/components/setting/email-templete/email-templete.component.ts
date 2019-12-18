import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { EmailTempleteService } from "./email-templete.service";
import { map, catchError } from "rxjs/operators";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { of } from "rxjs";
import { ToastrService } from "ngx-toastr";

import { AngularEditorConfig } from "@kolkov/angular-editor";

declare var $: any;

@Component({
  selector: "app-email-templete",
  templateUrl: "./email-templete.component.html",
  styleUrls: ["./email-templete.component.scss"]
})
export class EmailTempleteComponent implements OnInit {
  loading = false;
  submitted = false;
  edit = false;

  ticketTemplates: any;
  agentTemplates: any;
  invoiceTemplates: any;
  currentOpenTemplate = "";

  keywords: any[];
  templeteInfo: any;
  emailPreviewHtml: any;
  gettingEmailTemplatePreview: boolean;

  emailPages: any;
  templeteForm: FormGroup;
  openEmailTemplate: string;
  public show = false;
  public buttonName: any = "Show Keyword Description + ";
  templatesData = { subject: {}, body: {} };
  modalRef: BsModalRef;
  @ViewChild("body") body: ElementRef;
  @ViewChild("subject") subject: ElementRef;

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "15rem",
    minHeight: "5rem",
    placeholder: "Enter text here...",
    translate: "no",
    defaultParagraphSeparator: "p",
    defaultFontName: "Arial"
  };

  constructor(
    private modalService: BsModalService,
    private emailService: EmailTempleteService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
    this.ticketTemplates = this.emailService.getTicketTemplates();
    this.agentTemplates = this.emailService.getAgentTemplates();
    this.invoiceTemplates = this.emailService.getInvoiceTemplates();
  }

  openModal(template) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: "manage-tags modal-dialog-centered" })
    );
  }

  ngOnInit() {
    this.keywords = [];
    this.templeteForm = this.formBuilder.group({
      subject: ["", Validators.required],
      body: ["", Validators.required]
    });
    this.getEmailPages();
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
    console.log(eventData);
    eventData.plugins.get("FileRepository").createUploadAdapter = function(
      loader
    ) {
      console.log(btoa(loader.file));
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

    this.getEmailPages();
    this.templeteInfo = templete.value;
    this.loading = true;
    this.edit = true;
    this.emailService
      .getTemplate(templete.key)
      .pipe(
        map((res: any) => {
          this.loading = false;
          this.hideButtonTextEditor();

          if (res) {
            this.templatesData.body = res.body;
            this.templatesData.subject = res.subject;
            this.keywords = res.keywords;

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
    console.log(el);

    if (el.id === "subject") {
      console.log(this.subject);
      var startPos = this.subject.nativeElement.selectionStart;
      this.subject.nativeElement.focus();

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
    } else if (el.id === "editor") {
      this.insertDataVarables(el, text);
    }

    // this.insertDataVarables(el, text);
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
      console.log(myField);
      this.templeteForm.patchValue({
        body: myField.textContent
      });
      return;
    }
    // if (myField.selectionStart || myField.selectionStart == "0") {
    //   var startPos = myField.selectionStart;
    //   var endPos = myField.selectionEnd;
    //   myField.value =
    //     myField.value.substring(0, startPos) +
    //     myValue +
    //     myField.value.substring(endPos, myField.value.length);
    //   myField.selectionStart = startPos + myValue.length;
    //   myField.selectionEnd = startPos + myValue.length;
    //   myField.focus();
    // } else {
    //   myField.value += myValue;
    // }
    // if (myField.name === "subject") {
    //   this.templeteForm.patchValue({
    //     subject: myField.value
    //   });
    // } else if (myField.name === "body") {
    //   this.templeteForm.patchValue({
    //     body: myField.value
    //   });
    // }
  }

  emailPreview(templateKey: any) {
    this.emailPreviewHtml = undefined;
    this.gettingEmailTemplatePreview = true;

    alert("Api is remaining for our new design template");

    // this.emailService
    //   .getHtmlForPreview(templateKey, this.templatesData)
    //   .pipe(
    //     map(resp => {
    //       this.emailPreviewHtml = resp;
    //       this.gettingEmailTemplatePreview = false;
    //     })
    //   )
    //   .subscribe();
  }

  closeTemplete() {
    this.edit = false;
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
      // return matches && matches.length ? { invalid_characters: matches } : null;
    }

    // this.templeteForm.patchValue({
    //   body: this.body.nativeElement.value,
    //   subject: this.subject.nativeElement.value
    // });

    this.templeteForm.patchValue({
      body: this.templeteForm.value.body,
      subject: this.templeteForm.value.subject
    });

    this.loading = true;
    this.emailService
      .saveEmailTemplate(this.templeteForm.value, this.openEmailTemplate)
      .pipe(
        map(res => {
          this.submitted = false;
          this.edit = false;
          this.templeteForm.reset();
        })
      )
      .subscribe(
        () => {
          this.loading = false;
          this.toastr.success("Saved Successfully");
          this.getEmailPages();
        },
        error => {
          this.loading = false;
          this.toastr.error(`Error Occured  ${error}`);
        }
      );
  }

  /**
   * retore default templated
   * @param templeteKey
   */
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
      .subscribe(
        () => {
          this.toastr.success("Restored Successfully");
          this.getEmailPages();
        },
        error => {
          this.toastr.error(`Error Occured ${error}`);
        }
      );
  }

  toggle() {
    this.show = !this.show;

    if (this.show) {
      this.buttonName = "Hide Keyword Description - ";
    } else {
      this.buttonName = "Show Keyword Description + ";
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
    console.log(this.readThis(loader.file));
  }

  // upload() {
  //   return this.loader.file.then(
  //     file =>
  //       new Promise((resolve, reject) => {
  //         var myReader = new FileReader();
  //         myReader.onloadend = e => {
  //           resolve({ default: myReader.result });
  //         };

  //         myReader.readAsDataURL(file);
  //       })
  //   );
  // }

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
