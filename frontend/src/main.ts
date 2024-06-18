import { enableProdMode } from '@angular/core';
import {
  bootstrapApplication,
  provideClientHydration,
} from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http'; // Assurez-vous d'importer HTTP_INTERCEPTORS
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { AuthInterceptor } from './app/services/auth.interceptor';
import { AuthService } from './app/services/auth.service';
import { AuthEffects } from './app/store/effects/auth.effects';
import { HearthEffects } from './app/store/effects/hearths.effects';
import { UserEffects } from './app/store/effects/user.effects';
import { authReducer } from './app/store/reducers/auth.reducer';
import { hearthsReducer } from './app/store/reducers/hearths.reducer';
import { userReducer } from './app/store/reducers/user.reducer';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes),
    provideStore({
      user: userReducer,
      auth: authReducer,
      hearths: hearthsReducer,
    }),
    provideClientHydration(),
    provideEffects([AuthEffects, UserEffects, HearthEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
    AuthService,
  ],
});
