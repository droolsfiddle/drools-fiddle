import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-copy-button',
  templateUrl: './copy-button.component.html',
  styleUrls: ['./copy-button.component.scss']
})
export class CopyButtonComponent implements OnInit {
    text1: string;
    isCopied1: boolean;

  constructor() { }

  ngOnInit() {
  }

}
