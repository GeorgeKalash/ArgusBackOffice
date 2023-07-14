import { Component } from '@angular/core';
import { LoaderService } from '../Services/LoaderService';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { KVS_Service } from 'src/KVS_service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  shouldShowLinks = true;

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private API_Service: KVS_Service
  ) {}

  ngOnInit() {
    this.checkIfSignedIn();
    this.router.events.subscribe((val) => {
      this.shouldShowLinks = !this.router.url.includes('/signin');
    });
  }

  private checkIfSignedIn() : any {
    this.API_Service.getHeadersWithJwt_GET();
  }
  signOut() {
    // Perform sign-out logic here
    this.cookieService.deleteAll();
    // Redirect to the sign-in page or any other desired location
    this.router.navigate(['/signin']);
  }
}
