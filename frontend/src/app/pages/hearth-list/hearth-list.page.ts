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
import { Hearth } from 'src/app/models/hearth';
import { HearthService } from 'src/app/services/hearth.service';
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
  hearthList: Hearth[] = [];
  loading: boolean = true;

  constructor(private hearthService: HearthService) {}

  ngOnInit(): void {
    this.hearthService.getHearthsByUser().subscribe((data) => {
      this.hearthList = data;
      this.loading = false;
    });
  }
}
