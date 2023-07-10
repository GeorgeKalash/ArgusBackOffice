import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { LoaderService } from 'src/Services/LoaderService';

@Injectable({
  providedIn: 'root',
})
export class KVS_Service {
  public URL = 'https://deploy.arguserp.net/';

  constructor(
    private http: HttpClient, 
    private cookieService: CookieService,
    private loaderService: LoaderService
    ) {}

    async getRequest(body: any): Promise<any> {
      try {
        const url =
          this.URL + body.service + body.extension + '?' + body.parameters;
        const headers = this.getHeadersWithJwt(); // Get headers with JWT
  
        // Show loader
        this.loaderService.showLoader();
  
        const result = await this.http.get(url, { headers }).toPromise();
  
        // Hide loader on successful response
        this.loaderService.hideLoader();
  
        return result;
      } catch (error) {
        // Hide loader on error
        this.loaderService.hideLoader();
        throw error;
      }
    }

  // postRequest(request: any,formValues: any) {
  //   const url = this.URL + request.service + request.extension;
  //   const body = new HttpParams().set('record', JSON.stringify(formValues));

  // const headers = this.getHeadersWithJwt(); // Get headers with JWT

  // var result = this.http.post(url, body, { headers }).toPromise();
  //   console.log(result);
  //   return result;
  // }
  postRequest(request: any, formValues: any) {
    const url = this.URL + request.service + request.extension;
    const formData = new FormData();
    console.log(formValues); //result {datasetId: '2000', name: 'test'}
    console.log(JSON.stringify(formValues)); //result {"datasetId":"2000","name":"test"}
    formData.append('record', JSON.stringify(formValues)); // Convert the record object to a JSON string
    console.log(formData.get('record'));
    //const headers = this.getHeadersWithJwt(); // Get headers with JWT
    const headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${this.getJwtFromCookies()}`,
    });
    return this.http.post(url, formData, { headers }).toPromise();
  }

  private getHeadersWithJwt(): HttpHeaders {
    const jwt = this.getJwtFromCookies(); // Retrieve JWT from cookies
    const headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${jwt}`, // Add JWT to Authorization header
    });

    return headers;
  }

  private getJwtFromCookies(): string {
    const jwt = this.cookieService.get('key');
    return jwt;
  }
}
