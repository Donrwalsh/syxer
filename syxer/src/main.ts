import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { dataReducer } from './app/state/data.reducer';
import { provideEffects } from '@ngrx/effects';
import { DataEffects } from './app/state/data.effects';

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    // provideRouter(routes),
    provideStore({ data: dataReducer }),
    // provideEffects([DataEffects]), // add effects here
    provideRouter(routes),
    provideStoreDevtools({
      maxAge: 25,
      // logOnly: environment.production,
    }),
  ],
}).catch((err) => console.error(err));
