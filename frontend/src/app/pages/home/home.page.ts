import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonButton } from '@ionic/angular/standalone';
import { HeaderComponent } from "../../shared/header/header.component"

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    standalone: true,
    imports: [IonButton, IonCol, IonRow, IonGrid, IonHeader, IonToolbar, IonTitle, IonContent, RouterModule, HeaderComponent]
})
export class HomePage {
  constructor() {}
}
