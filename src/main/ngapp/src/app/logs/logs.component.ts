import {Component, OnDestroy, OnInit} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {Message} from "../models/message.model";
import {Subscription} from "rxjs/index";
import {LogsService} from "../services/logs.service";

/* This component displays the log screen */

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
    providers: [NGXLogger]
})
export class LogsComponent implements OnInit, OnDestroy {

    public messages: string= '' ;
    messagesSubscription: Subscription;

  constructor(private logger: NGXLogger, private logsService: LogsService) {
      this.logsService.addMessage("Application Works");
      this.logsService.addMessage({"id":0,"name":"Command","attributes":[{"id":0,"name":"client","type":"defaultpkg.Custom","enumValues":null},{"id":1,"name":"order","type":"defaultpkg.Orders","enumValues":null}]});
  }

  ngOnInit() {

      this.messagesSubscription = this.logsService.stringOfMessagesSubject.subscribe(
          (messages: string) => {
              this.messages = messages;
          }
      );
      this.logsService.emitStringOfMessagesSubject();
  }

  ngOnDestroy(){
      this.messagesSubscription.unsubscribe();
  }

}
