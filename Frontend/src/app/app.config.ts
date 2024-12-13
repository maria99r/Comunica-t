import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideNgxStripe } from 'ngx-stripe';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {

  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    // Habilita el uso de HttpClient
    provideHttpClient(),
    provideAnimations(),
    MessageService,
    provideNgxStripe('pk_test_51QJzjBGpuU9RUuINyYBBFi82AF24dw2g47VEUNqRhUuOsu0TZJA8n5MDEnEARsDZ7PjIyLTrEUeeLQEKHSuvSevs00a344BtUG'),
  ]
};
