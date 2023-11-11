import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  pageTitle: string = '';

  constructor(private titleService: Title) {}

  ngOnInit() {
    this.pageTitle = this.titleService.getTitle();
    console.log(this.pageTitle);
  }
}
