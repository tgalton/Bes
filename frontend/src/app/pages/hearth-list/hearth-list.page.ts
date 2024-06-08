import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { addIcons } from 'ionicons';

import { homeOutline } from 'ionicons/icons';
import { Observable, Subscription } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { Hearth } from 'src/app/models/hearth';
import { HeaderComponent } from 'src/app/shared/header/header.component';
import { HearthLineComponent } from 'src/app/shared/hearth-line/hearth-line.component';
import { selectHearthsLoaded } from 'src/app/store/selectors/hearths.selector';

@Component({
  standalone: true,
  imports: [
    IonButton,
    IonIcon,
    IonItem,
    IonList,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    HearthLineComponent,
    HeaderComponent,
  ],
  selector: 'app-hearth-list',
  templateUrl: './hearth-list.page.html',
  styleUrls: ['./hearth-list.page.scss'],
})
export class HearthListComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  // user$: Observable<User | null>;
  hearthList$: Observable<Hearth[]> = this.store.select(selectHearthsLoaded);
  loading: boolean = true;

  constructor(private store: Store<AppState>) {
    addIcons({ homeOutline });
    // this.user$ = this.store.select(selectUser);
  }
  ngOnInit(): void {
    this.subscription.add(
      this.hearthList$.subscribe((hearths) => {
        console.log('Hearths loaded:', hearths);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
