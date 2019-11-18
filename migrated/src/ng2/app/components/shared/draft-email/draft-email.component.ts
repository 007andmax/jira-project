import { Component, OnInit } from '@angular/core';
import { DraftEmailStateService } from 'src/ng2/app/states/draft-email/draft-email-state.service';
import { DraftEmail } from './class/draft-email';

@Component({
  selector: 'app-draft-email',
  templateUrl: './draft-email.component.html',
  styleUrls: ['./draft-email.component.scss']
})
export class DraftEmailComponent implements OnInit {
  opened = false;
  htmlContent:string = '';
  title = 'ngx-editor';

  editorConfig = {
    editable: true,
    spellcheck: false,
    height: '10rem',
    minHeight: '5rem',
    placeholder: 'Type something. Test the Editor... ヽ(^。^)丿',
    translate: 'no'
  };
  draftEmail:DraftEmail = new DraftEmail();
   
  constructor(private draftEmailStateService:DraftEmailStateService) { }

  ngOnInit() {
    this.onShowAside();
  }
  public onShowAside() {
    this.draftEmailStateService.getShowAsideForAdd().subscribe(() => {
      this.opened = true;
      this.draftEmail = new DraftEmail();
    })
  }
  close() {
    this.opened = false;
  }
  public uploadFileOnBrower(event) {
    console.log('event', event);
    if (event.target.value) {
      const file = event.target.files[0];
      console.log('file', file);
      this.uploadFile(file).then((data: any) => {
        let res = JSON.parse(data.response);
        // this.changeFile(file).then((base64: string): any => {
        this.draftEmail.addAttachment(res.id);
       
       event.target.value = null;

        // });

      });

    } else alert('Nothing')
  }
  uploadFile(file) {
    return new Promise((resolve, reject) => {
      //  var file = this.dataURLtoFile(this.img, this.fileName);
      console.log(file);
      var fd = new FormData();
      fd.append("file", file);
      var xhr = new XMLHttpRequest();
      xhr.addEventListener("load", (event) => {

        resolve(xhr);

      }, false);
      xhr.addEventListener("error", (error) => {
        reject(error);
      }, false);


      xhr.open("POST", "/file?isAvatar=false");
      xhr.send(fd);
    });
  }
}
