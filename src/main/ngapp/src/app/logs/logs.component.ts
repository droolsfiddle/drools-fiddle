import { Component, OnInit } from '@angular/core';
import {NGXLogger} from "ngx-logger";

/* This component displays the log screen */

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
    providers: [NGXLogger]
})
export class LogsComponent implements OnInit {

    public messages = { 0:{ date:"", message:""} };

  constructor(private logger: NGXLogger) {
      this.messages = new Date().toTimeString() + ':' + JSON.stringify({"id":0,"name":"Command","attributes":[{"id":0,"name":"client","type":"defaultpkg.Custom","enumValues":null},{"id":1,"name":"order","type":"defaultpkg.Orders","enumValues":null}]}, null, 4);
      this.logger.info('Your log message goes here');
      this.logger.error('Multiple', 'Argument', 'support');
  }

  ngOnInit() {
  }

}
