import {Component, OnDestroy, OnInit} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {Message} from "../models/message.model";
import {Subscription} from "rxjs/index";
import {LogsService} from "../services/logs.service";
import {MatTableDataSource} from "@angular/material";


/* This component displays the log screen */

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
    providers: [NGXLogger]
})
export class LogsComponent implements OnInit, OnDestroy {

    public messages: Message[] ;
    messagesSubscription: Subscription;

    public displayedColumns = ['id', 'date', 'type', 'message'];

    public datatSource;

  constructor(private logger: NGXLogger, private logsService: LogsService) {
      this.logsService.addMessage("Server-Log",{message:"Application Works"}, "success");
      this.logsService.addMessage("insert-fact",{"id":0,"name":"Command","attributes":[{"id":0,"name":"client","type":"defaultpkg.Custom","enumValues":null},{"id":1,"name":"order","type":"defaultpkg.Orders","enumValues":null}]}, "info");

    }

    getColor(level : string){
        switch (level) {
            case "success": {
                return "green";
            }
            case "danger": {
                return "red";
            }
            case "warning": {
                return "orange";
            }
            case "info": {
                return "black";
            }
            default: {
                return "black";
            }
        }
    }

  ngOnInit() {

      this.messagesSubscription = this.logsService.messagesSubject.subscribe(
          (messages: Message[]) => {
              this.messages = messages;
          }
      );
      this.logsService.emitMessagesSubject();
      this.datatSource = new MatTableDataSource(this.messages);
      console.log(this.datatSource);
  }

  ngOnDestroy(){
      this.messagesSubscription.unsubscribe();
  }

}
