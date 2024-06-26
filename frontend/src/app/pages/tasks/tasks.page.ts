import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { IonDatetime } from '@ionic/angular/standalone';

import { IonicModule, ModalController } from '@ionic/angular';
import { HeaderComponent } from '../../shared/header/header.component';
import { TaskComponent } from './taskComponent/task/task.component';

import { Store } from '@ngrx/store';
import { addIcons } from 'ionicons';
import { caretDownOutline } from 'ionicons/icons';
import { Observable, first, tap } from 'rxjs';
import { Hearth } from 'src/app/models/hearth';
import { Task } from 'src/app/models/task';
import { HearthService } from 'src/app/services/hearth.service';
import { HearthLineComponent } from 'src/app/shared/hearth-line/hearth-line.component';
import { selectHearthsLoaded } from 'src/app/store/selectors/hearths.selector';
import { SelectHearthModalComponent } from './taskComponent/select-hearth-modal/select-hearth-modal.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: true,
  imports: [
    TaskComponent,
    CommonModule,
    IonicModule,
    FormsModule,
    HeaderComponent,
    HearthLineComponent,
  ],
})
export class TasksPage implements OnInit {
  listOfTasks: Task[] = [
    new Task(1, 'Vaisselle', 0, 1, 1, 1),
    new Task(2, 'Aspirateur', 0, 1, 1, 1),
    new Task(3, 'Balayer', 0, 1, 1, 1),
    new Task(4, 'Courses', 0, 1, 1, 1),
    new Task(5, 'Serpillère', 0, 1, 1, 1),
    new Task(6, 'Poubelle', 0, 1, 1, 1),
    new Task(7, 'Litière', 0, 1, 1, 1),
    new Task(8, 'Point bonus', 0, 1, 1, 1),
    new Task(9, 'Nettoyer truc', 0, 1, 1, 1),
    new Task(10, 'Chercher bois', 0, 1, 1, 1),
    new Task(11, 'Ranger Linge', 0, 1, 1, 1),
  ];

  @ViewChild('dateTime', { static: false }) dateTime!: IonDatetime;
  today = new Date(Date.now());

  hearthList$: Observable<Hearth[]>;
  selectedHearth!: Hearth;

  //Form to edit task
  formEditTask = new FormControl();
  taskId?: number;
  taskdifficulty?: number;
  taskDuration?: number;
  taskNewName?: string;
  taskName?: string;
  taskCurrentName?: string;

  hiddenCreateTask: boolean = true;
  newTaskdifficulty?: number;
  newTaskDuration?: number;
  newTaskPoint?: number;

  constructor(
    private modalCtrl: ModalController,
    private store: Store,
    private hearthService: HearthService
  ) {
    this.hearthList$ = this.store.select(selectHearthsLoaded);
    addIcons({ caretDownOutline });
    // this.user$ = this.store.select(selectUser);
  }

  ngOnInit() {
    this.hearthList$
      .pipe(
        first(), // Prend le premier tableau de Hearths émis
        tap((hearths) => {
          if (hearths && hearths.length > 0) {
            this.selectedHearth = hearths[0]; // Définir le premier Hearth comme sélection par défaut
          }
        })
      )
      .subscribe();
  }

  async openHearthSelectionModal() {
    // Souscrire à l'Observable et obtenir les données initiales
    const hearths = await this.hearthList$.pipe(first()).toPromise();

    // Créer le modal en passant les données récupérées
    const modal = await this.modalCtrl.create({
      component: SelectHearthModalComponent,
      componentProps: { hearths: hearths },
    });

    modal.onDidDismiss().then((data) => {
      if (data.role === 'select') {
        this.selectedHearth = data.data;
        console.log('Selected Hearth:', this.selectedHearth);
      }
    });

    return await modal.present();
  }

  updateTask(task: Task) {
    const index = this.listOfTasks.findIndex((t) => t.id === task.id);
    if (index !== -1) {
      this.listOfTasks[index] = task;
    }
    console.log(task);
    console.log(this.listOfTasks);
  }

  editTask(task: Task) {}

  // Toggle button
  onClickButtonCreate() {
    this.hiddenCreateTask = !this.hiddenCreateTask;
  }
  // Used to clear datePicker -> current date
  onClearButtonClicked() {
    this.dateTime.value = this.today.toISOString();
    this.dateTime.reset();
  }
  updateTaskPoint() {
    this.newTaskPoint = this.calculPoint(
      this.newTaskdifficulty,
      this.newTaskDuration
    );
  }
  // Used to directly put a pointTask from difficulty and Duration

  calculPoint(
    taskdifficulty: number | undefined,
    taskDuration: number | undefined
  ): number {
    if (taskdifficulty !== undefined && taskDuration !== undefined) {
      return Math.floor(taskDuration * (1 + 0.3 * taskdifficulty));
    } else {
      return 1;
    }
  }
  onOkayButtonClicked() {}

  testType(task: Task) {}
}
