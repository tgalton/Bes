import { Component } from '@angular/core';
import {
  IonApp,
  IonContent,
  IonHeader,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { HeaderComponent } from './shared/header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonContent,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonApp,
    IonRouterOutlet,
    HeaderComponent,
    // StoreModule.forRoot(reducers), // Configurez vos reducers ici
    // EffectsModule.forRoot(effects), // Configurez vos effects ici, si nécessaire
  ],
})
export class AppComponent {
  constructor() {}
}
