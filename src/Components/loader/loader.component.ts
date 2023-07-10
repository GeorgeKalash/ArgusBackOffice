import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from 'src/Services/LoaderService';

@Component({
  selector: 'app-loader',
  template: `
  <div *ngIf="isLoading" class="default-loader">
  <div>
    <ngx-spinner type="bubbles" size="medium" color="#000000"></ngx-spinner>
  </div>
</div>
`,
  styleUrls: ['./loader.component.scss']
})

export class LoaderComponent implements OnDestroy {
  isLoading: boolean = false;
  private subscription: Subscription;

  constructor(private loaderService: LoaderService) {
    this.subscription = this.loaderService.isLoading.subscribe(
      (isLoading: boolean) => {
        this.isLoading = isLoading;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}