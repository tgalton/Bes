import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonHeader, IonToolbar, IonTitle } from '@ionic/angular/standalone';
import { HeaderComponent } from './shared/header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonTitle, IonToolbar, IonHeader, IonApp, IonRouterOutlet, HeaderComponent],
})
export class AppComponent {
  constructor() {}
}
