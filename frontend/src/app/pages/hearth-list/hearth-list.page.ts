import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { Hearth } from 'src/app/models/hearth';
import { User } from 'src/app/models/user';
import { selectUser } from 'src/app/store/selectors/auth.selector';
import { selectHearthsLoaded } from 'src/app/store/selectors/hearths.selector';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  standalone: true,
  imports: [
    IonItem,
    IonList,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    HeaderComponent,
  ],
  selector: 'app-hearth-list',
  templateUrl: './hearth-list.page.html',
  styleUrls: ['./hearth-list.page.scss'],
})
export class HearthListComponent implements OnInit {
  user$: Observable<User | null>;
  hearthList: Hearth[] = [];
  loading: boolean = true;

  constructor(private store: Store<AppState>) {
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.user$.subscribe((user) => {
      if (user) {
        this.store.select(selectHearthsLoaded);
      }
    });
  }
}
