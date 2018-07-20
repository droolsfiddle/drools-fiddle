import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  @Input() messageDate: string;
  @Input() messageMessage: string;
  @Input() messageColor: string;


  constructor() { }

  ngOnInit() {
  }

}
