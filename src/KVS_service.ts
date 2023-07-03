import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class KVS_Service {
    public URL ="https://deploy.arguserp.net/";

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getRequest(body: any): Promise<any> {
    console.log(body);
    const url = this.URL + body.service + body.extension + '?' + body.parameters;
    const headers = this.getHeadersWithJwt(); // Get headers with JWT
    console.log(url);
    console.log(headers);
    return this.http.get(url, { headers }).toPromise();
  }

  postRequest(body: any) {
    const url = URL + body.service + body.extension;
    const bodyFormData = new FormData();
    bodyFormData.append('record', body.record);
    const headers = this.getHeadersWithJwt(); // Get headers with JWT

    return this.http.post(url, bodyFormData, { headers }).toPromise();
  }

  private getHeadersWithJwt(): HttpHeaders {
    const jwt = this.getJwtFromCookies(); // Retrieve JWT from cookies
    const headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${jwt}` // Add JWT to Authorization header
    });

    return headers;
  }

  private getJwtFromCookies(): string {
    const jwt = this.cookieService.get('key');
    return jwt;
  }
}