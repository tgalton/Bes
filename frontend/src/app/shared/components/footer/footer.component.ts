import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  pageTitle: string = '';

  constructor(private titleService: Title) {}

  ngOnInit() {
    this.pageTitle = this.titleService.getTitle();
    console.log(this.pageTitle);
  }
}
