import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AvatarService } from 'src/app/services/avatar.service';
import { ScoreService } from 'src/app/services/score.service';

@Component({
  selector: 'app-progress-chart',
  templateUrl: './progress-chart.component.html',
  styleUrls: ['./progress-chart.component.scss'],
  animations: [
    trigger('markerMove', [
      state(
        'move',
        style({
          left: '{{left}}%',
        }),
        { params: { left: 0 } }
      ),
      transition('* => move', [animate('1s ease-in-out')]),
    ]),
  ],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class ProgressChartComponent implements OnInit, OnChanges {
  @Input() hearthId!: number;
  scores: any[] = [];
  avatars: { [key: string]: string } = {};
  minScore: number = 0;
  maxScore: number = 100;

  constructor(
    private scoreService: ScoreService,
    private avatarService: AvatarService
  ) {}

  ngOnInit() {
    this.loadScores();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['hearthId'] && !changes['hearthId'].firstChange) {
      this.loadScores();
    }
  }

  loadScores() {
    this.scoreService.getScoreByHearth(this.hearthId).subscribe((scores) => {
      this.scores = scores;
      this.updateScoreRange();
      this.loadAvatars();
    });
  }

  updateScoreRange() {
    if (this.scores.length > 0) {
      this.minScore =
        Math.floor(
          Math.min(...this.scores.map((score) => score.corrected_score)) / 10
        ) * 10;
      this.maxScore =
        Math.ceil(
          Math.max(...this.scores.map((score) => score.corrected_score)) / 10
        ) * 10;
    }
  }

  loadAvatars() {
    const avatarObservables = this.scores.map((score) =>
      this.avatarService.getAvatarPathFromName(score.avatar).pipe(
        tap((path) => {
          this.avatars[score.avatar] = path;
        })
      )
    );

    forkJoin(avatarObservables).subscribe();
  }

  getMarkerPosition(score: number): number {
    return ((score - this.minScore) / (this.maxScore - this.minScore)) * 100;
  }
}
