import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { IonDatetime } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { addIcons } from 'ionicons';
import { caretDownOutline } from 'ionicons/icons';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { Hearth } from 'src/app/models/hearth';
import { Task } from 'src/app/models/task';
import { HearthService } from 'src/app/services/hearth.service';
import { TaskService } from 'src/app/services/task.service';
import { HearthLineComponent } from 'src/app/shared/hearth-line/hearth-line.component';
import { loadHearths } from 'src/app/store/actions/hearths.actions';
import { selectUser } from 'src/app/store/reducers/auth.reducer';
import { selectHearthsLoaded } from 'src/app/store/selectors/hearths.selector';
import { HeaderComponent } from '../../shared/header/header.component';
import { SelectHearthModalComponent } from './taskComponent/select-hearth-modal/select-hearth-modal.component';
import { TaskComponent } from './taskComponent/task/task.component';

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
  listOfTasks: Task[] = [];
  isLoading = true; // flag de chargement

  @ViewChild('dateTime', { static: false }) dateTime!: IonDatetime;
  today = new Date(Date.now());

  hearthList$: Observable<Hearth[]>;
  selectedHearth$ = new BehaviorSubject<Hearth | null>(null);

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
  private subscription: Subscription = new Subscription();

  userId$: Observable<number | undefined> = this.store
    .select(selectUser)
    .pipe(map((user) => user?.id));
  constructor(
    private modalCtrl: ModalController,
    private store: Store,
    private hearthService: HearthService,
    private taskService: TaskService
  ) {
    this.hearthList$ = this.store.select(selectHearthsLoaded);
    addIcons({ caretDownOutline });
  }

  ngOnInit() {
    this.userId$
      .pipe(
        filter((userId) => userId !== undefined),
        switchMap((userId) => {
          this.isLoading = true;
          this.store.dispatch(loadHearths({ userId: userId! }));
          return this.store.select(selectHearthsLoaded);
        }),
        switchMap((hearths) => {
          if (hearths.length > 0) {
            this.selectedHearth$.next(hearths[0]);
            return this.taskService.getAllPossibleTasks(hearths[0].id);
          } else {
            return of([]);
          }
        })
      )
      .subscribe(
        (tasks) => {
          this.listOfTasks = tasks;
          this.isLoading = false;
        },
        (error) => {
          console.error('Error loading tasks:', error);
          this.isLoading = false;
        }
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async openHearthSelectionModal() {
    const hearths = await this.hearthList$.pipe(first()).toPromise();

    const modal = await this.modalCtrl.create({
      component: SelectHearthModalComponent,
      componentProps: { hearths: hearths },
    });

    modal.onDidDismiss().then((data) => {
      if (data.role === 'select') {
        this.selectedHearth$.next(data.data);
        console.log('Selected Hearth by modal:', data.data);
        this.isLoading = true; // Début du chargement
        this.taskService
          .getAllPossibleTasks(data.data.id)
          .subscribe((tasks) => {
            this.listOfTasks = tasks;
            this.isLoading = false; // Fin du chargement
          });
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

  onClickButtonCreate() {
    this.hiddenCreateTask = !this.hiddenCreateTask;
  }

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
