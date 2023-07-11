import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { LoaderService } from 'src/Services/LoaderService';

@Injectable({
  providedIn: 'root',
})
export class MA_Service {
  public URL = 'https://identity.arguserp.net/';

  constructor(
    private http: HttpClient, 
    private cookieService: CookieService,
    private loaderService: LoaderService
    ) {}

    async signin3(body: any): Promise<any> {
      try {
        const url =
          this.URL + body.service + body.extension + '?' + body.parameters;
        
        // Show loader
        this.loaderService.showLoader();
  
        const result = await this.http.get(url).toPromise();
  
        // Hide loader on successful response
        this.loaderService.hideLoader();
  
        return result;
      } catch (error) {
        // Hide loader on error
        this.loaderService.hideLoader();
        throw error;
      }
    }


  private getJwtFromCookies(): string {
    const jwt = this.cookieService.get('keyAcc');
    return jwt;
  }
}
