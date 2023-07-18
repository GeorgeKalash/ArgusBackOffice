import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { LoaderService } from 'src/Services/LoaderService';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class KVS_Service {
  public URL = 'https://deploy.arguserp.net/';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private loaderService: LoaderService,
    private router: Router
  ) {}

  async getRequest(body: any): Promise<any> {
    try {
      this.loaderService.showLoader();
      const url =
        this.URL + body.service + body.extension + '?' + body.parameters;
      const headers = this.getHeadersWithJwt_GET(); // Get headers with JWT
      if (headers != null) {
        const result = await this.http.get(url, { headers }).toPromise();
        // Hide loader on successful response
        this.loaderService.hideLoader();

        return result;
      }

      this.loaderService.hideLoader();
      return null;
    } catch (error) {
      // Hide loader on error
      this.loaderService.hideLoader();
      throw error;
    }
  }
  async getTranslator(body: any): Promise<any> {
    try {
      this.loaderService.showLoader();
      const url =
        this.URL + body.service + body.extension + '?' + body.parameters;
      const headers = new HttpHeaders({
        'Content-Type': 'multipart/form-data',
        Authorization: `Basic AC7436E4C119D2D235680BFFF8C6DED8C0E61A3C6A5220787A1FC6618F53AE8E5A92DD74C626D804FBC5A2DD901B0B87F2333F8E60E048AE9C9722C91952EA80`, // Add JWT to Authorization header
      });
      if (headers != null) {
        // Show loader
        const result = await this.http.get(url, { headers }).toPromise();

        // Hide loader on successful response
        this.loaderService.hideLoader();

        return result;
      }

      this.loaderService.hideLoader();
      return null;
    } catch (error) {
      // Hide loader on error
      this.loaderService.hideLoader();
      throw error;
    }
  }
 
  postRequest(request: any, formValues: any) {
    try {
      this.loaderService.showLoader();
      const url = this.URL + request.service + request.extension;
      const formData = new FormData();
      //console.log(JSON.stringify(formValues));
      formData.append('record', JSON.stringify(formValues)); // Convert the record object to a JSON string
      const headers = this.getHeadersWithJwt_POST(); // Get headers with JWT
      if (headers != null) {
        this.loaderService.hideLoader();
        //console.log(url);
        //console.log(headers);
        return this.http.post(url, formData, { headers: headers }).toPromise();
      } else {
        this.loaderService.hideLoader();
        return Promise.resolve({}); // Return an empty object wrapped in a resolved promise
      }
    } catch (error) {
      // Hide loader on error
      this.loaderService.hideLoader();
      throw error;
    }
  }
  

  public getHeadersWithJwt_GET(): any {
    const jwt = this.getJwtFromCookies(); // Retrieve JWT from cookies
    var tokenValid = this.isTokenExpired(jwt);
    if (!tokenValid) {
      const headers = new HttpHeaders({
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${jwt}`, // Add JWT to Authorization header
      });

      return headers;
    }
    return null;
  }
  private getHeadersWithJwt_POST(): any {
    const jwt = this.getJwtFromCookies(); // Retrieve JWT from cookies
    var tokenValid = this.isTokenExpired(jwt);
    if (!tokenValid) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${jwt}`, // Add JWT to Authorization header
      });

      return headers;
    }
    return null;
  }

  private isTokenExpired(token: string): boolean {
    if (token === null || token === '') {
      this.router.navigate(['/signin']); // Redirect to /signin
      return true; // Token was not saved yet in the cookie
    }
    const decodedToken: any = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp && decodedToken.exp < currentTime) {
      this.router.navigate(['/signin']); // Redirect to /signin
      return true; // Token is expired
    } else {
      return false; // Token is not expired
    }
  }

  private getJwtFromCookies(): string {
    const jwt = this.cookieService.get('keyAcc');
    return jwt;
  }
}
