import { Component, Input, OnInit } from '@angular/core';
import { Hearth } from 'src/app/models/hearth';

interface ImageHearth {
  name: string;
  path: string;
}

@Component({
  selector: 'app-hearth-line',
  templateUrl: './hearth-line.component.html',
  styleUrls: ['./hearth-line.component.scss'],
  standalone: true,
})
export class HearthLineComponent implements OnInit {
  @Input() hearth!: Hearth;

  constructor() {}

  ngOnInit() {
    console.log('testHearthLine');
  }
}
