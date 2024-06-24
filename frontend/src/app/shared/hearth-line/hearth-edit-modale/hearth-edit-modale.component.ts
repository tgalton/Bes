import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs/internal/Subscription';
import { Hearth } from 'src/app/models/hearth';
import { AvatarService } from 'src/app/services/avatar.service';
import { HearthService } from 'src/app/services/hearth.service';

@Component({
  selector: 'app-hearth-edit-modale',
  templateUrl: './hearth-edit-modale.component.html',
  styleUrls: ['./hearth-edit-modale.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
})
export class HearthEditModaleComponent implements OnInit, OnDestroy {
  @Input() hearth!: Hearth;
  hearthForm!: FormGroup;
  hearthImages: any[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private avatarService: AvatarService,
    private cd: ChangeDetectorRef,
    private hearthService: HearthService
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.avatarService.getAllHearthImage().subscribe({
      next: (hearthsImages) => {
        this.hearthImages = hearthsImages;

        this.cd.detectChanges(); // Force Angular to recognize the update
      },
      error: (error) => {
        console.error('Failed to load HearthImage:', error);
      },
    });

    this.initializeForm();
  }

  updateHearth(updates: Partial<Hearth>) {
    if (this.hearthForm.valid) {
      const hearthId = this.hearth.id;
      this.hearthService.updateHearthDetails(hearthId, updates).subscribe({
        next: (updatedHearth) => {
          console.log('Hearth updated!', updatedHearth);
          this.modalCtrl.dismiss({
            dismissed: true,
          });
        },
        error: (error) => {
          console.error('Failed to update hearth', error);
        },
      });
    }
  }

  changeHearthImage(hearthImage: any) {
    const hearthUpdate: Partial<Hearth> = { imageName: hearthImage.name };
    this.updateHearth(hearthUpdate);
  }

  initializeForm() {
    this.hearthForm = this.formBuilder.group({
      name: [this.hearth.name || '', Validators.required],
      adminId: [
        this.hearth.adminId ||
          (this.hearth.hearthUsers && this.hearth.hearthUsers.length > 0
            ? this.hearth.hearthUsers[0].id
            : ''),
        Validators.required,
      ],
    });
  }

  removeUser(userId: number) {
    console.log(userId);
    this.hearthService
      .deleteHearthUser(this.hearth.id.toString(), userId.toString())
      .subscribe({
        next: (updatedHearth) => {
          console.log('User removed', updatedHearth);
          this.modalCtrl.dismiss({
            dismissed: true,
          });
          // Update local state or trigger some behavior
        },
        error: (error) => console.error('Failed to remove user', error),
      });
  }
}
