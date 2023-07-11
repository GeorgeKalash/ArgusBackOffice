import { Input, Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MA_Service } from 'src/MA_service';
import { IdentityServerService } from 'src/WebServices/IdentityServerService';
import { SHA1 } from 'crypto-js';
import { CookieService } from 'ngx-cookie-service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { KVS_Service } from 'src/KVS_service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  form: FormGroup;
  constructor(
    private API_Service: MA_Service,
    private kvs_service: KVS_Service,
    private formBuilder: FormBuilder,
    private cookieService: CookieService,
    public dialog: MatDialog) {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  getErrorMessage() {
    return this.form.hasError('required') ? 'Required field' :
    '';
    }

    
  submit() {
    // request KVS.getTranslator
    // if success -> request signin3 and store the token and the userType
    // else show a message that this user is not a translator
    const formValue = this.form.value;
    const parameters = `_email=${formValue.username}&_password=${this.encryptPWD(formValue.password)}&_accountId=100&_userId=59`;
    var request = {
      service: IdentityServerService.service,
      extension: IdentityServerService.signIn3,
      parameters: parameters
    };
    //signin3
    this.API_Service.signin3(request)
      .then((data) => {     
        this.cookieService.set('keyAcc', ''+data.record.accessToken, 0, '/', '');
        // this.cookieService.set('key', ''+data.record.accessToken, 0, '/', 'localhost', true, 'None');
        //save access token and refresh token to cookies
      })
      .catch((error) => {
        this.dialog.open(AlertDialogComponent, {
          data: {
            title: error.status + ' ' + error.name,
            message: error.error.error 
          }
        });
      });
  }

    encryptPWD(password: string): string {
      const encryptedPWD = SHA1(password).toString();
      let shuffledString = '';
  
      for (let i = 0; i < encryptedPWD.length; i = i + 8) {
        const subString = encryptedPWD.slice(i, i + 8);
  
        shuffledString += subString.charAt(6) + subString.charAt(7);
        shuffledString += subString.charAt(4) + subString.charAt(5);
        shuffledString += subString.charAt(2) + subString.charAt(3);
        shuffledString += subString.charAt(0) + subString.charAt(1);
      }
      return shuffledString.toUpperCase();
    }
  @Input() error: string | null = null;

  @Output() submitEM = new EventEmitter();
}
