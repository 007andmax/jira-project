import { Component, OnInit } from '@angular/core';
import { SignatureService } from 'src/app/services/signature/signature.service';

@Component({
  selector: 'signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss']
})
export class SignatureComponent implements OnInit {
  content: string;
  loading: boolean = true;
  constructor(private signatureService: SignatureService) { }

  ngOnInit() {
    this.signatureService.getSignature().subscribe((data: any) => {
      if (data) {
        this.content = data.content;
      }
      this.loading = false;
    }, err => {
      this.loading = false;
    })
  }

}
