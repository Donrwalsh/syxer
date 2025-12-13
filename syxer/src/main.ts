import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { configReducer } from './app/state/config.reducer';
import { dataReducer } from './app/state/data.reducer';
import { metaReducers } from './app/state/meta-reducers';

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    // provideRouter(routes),
    provideStore({ data: dataReducer, config: configReducer }, { metaReducers }),
    // provideEffects([DataEffects]), // add effects here
    provideRouter(routes),
    provideStoreDevtools({
      maxAge: 25,
      // logOnly: environment.production,
    }),
  ],
}).catch((err) => console.error(err));
