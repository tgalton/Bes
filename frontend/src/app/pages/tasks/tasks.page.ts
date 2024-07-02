import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { IonDatetime } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { addIcons } from 'ionicons';
import { caretDownOutline } from 'ionicons/icons';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { debounceTime, filter, first, map, switchMap } from 'rxjs/operators';
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
  taskCountsToday: { [taskId: number]: number } = {};
  isLoading = true; // flag de chargement

  @ViewChild('dateTime', { static: false }) dateTime!: IonDatetime;
  today = new Date(Date.now());

  hearthList$: Observable<Hearth[]>;
  selectedHearth$ = new BehaviorSubject<Hearth | null>(null);

  hiddenCreateTask: boolean = true;

  //Form to edit task
  formEditTask = new FormControl();
  newTaskdifficulty?: number;
  newTaskDuration?: number;
  newTaskPoint?: number;
  taskNewName?: string;
  private subscription: Subscription = new Subscription();

  // Récupère l'id pour avoir la liste des hearths plus tard
  userId$: Observable<number | undefined> = this.store
    .select(selectUser)
    .pipe(map((user) => user?.id));

  private updateSubject = new BehaviorSubject<void>(undefined);

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
          this.updateTasksCountToday(); // Mise à jour des tâches réalisées aujourd'hui
          this.isLoading = false;
        },
        (error) => {
          console.error('Error loading tasks:', error);
          this.isLoading = false;
        }
      );

    this.updateSubject.pipe(debounceTime(2000)).subscribe(() => {
      this.submitTaskCount();
    });

    // Mise à jour des tâches réalisées aujourd'hui lorsqu'un foyer est sélectionné
    this.selectedHearth$.subscribe(() => {
      this.updateTasksCountToday();
    });
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

  updateTaskCount(event: { taskId: number; count: number }) {
    console.log(`Updating task ${event.taskId} with new value ${event.count}`);
    const task = this.listOfTasks.find((t) => t.id === event.taskId);
    if (task) {
      task.value = +event.count;
    }
    this.updateSubject.next();
  }

  submitTaskCount() {
    const tasksToUpdate = this.listOfTasks
      .filter((task) => task.value > 0)
      .flatMap((task) => {
        const countDifference =
          task.value - (this.taskCountsToday[task.id] || 0);
        return Array(Math.abs(countDifference)).fill({
          possible_task_id: task.id,
          count: Math.sign(countDifference),
        });
      });

    console.log('Tasks to update: ', tasksToUpdate);

    if (tasksToUpdate.length > 0) {
      this.taskService.addMultipleMadeTasks(tasksToUpdate).subscribe(
        () => {
          console.log('Tasks updated successfully');
          this.updateTasksCountToday(); // Mise à jour après soumission
        },
        (error) => {
          console.error('Error updating tasks:', error);
        }
      );
    }
  }

  editTask(task: Task) {}

  onClickButtonCreate() {
    this.hiddenCreateTask = !this.hiddenCreateTask;
  }

  updateTaskPoint() {}

  updateTasksCountToday() {
    const selectedHearth = this.selectedHearth$.getValue();
    if (selectedHearth) {
      this.taskService
        .getMadeTasksToday(selectedHearth.id)
        .subscribe((tasks) => {
          const counts: { [taskId: number]: number } = {};
          tasks.forEach((task) => {
            counts[task.id] = (counts[task.id] || 0) + 1;
          });
          this.taskCountsToday = counts;
        });
    }
  }
}
