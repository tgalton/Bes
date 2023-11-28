import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-hearth',
  templateUrl: './hearth.page.html',
  styleUrls: ['./hearth.page.scss'],
})
export class HeartPage implements OnInit {
  constructor(private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Foyers');
  }
}
