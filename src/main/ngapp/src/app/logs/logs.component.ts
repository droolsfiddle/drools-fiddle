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

    public messages: Message[] ;
    messagesSubscription: Subscription;

    public displayedColumns = ['id', 'date', 'type', 'message'];

    public datatSource;

    public searchString: string;
    public searchField: string = 'type';
    public searchFields: string[];

    public x = [5,10,25, 30 ];

  constructor(private logger: NGXLogger, private logsService: LogsService) {
      this.logsService.addMessage("Server-Log",{message:"Application Works"}, "success");
      this.logsService.addMessage("Server-Log",{message:"Application Works"}, "success");
      this.logsService.addMessage("Log",{message:"Application Works"}, "success");
      this.logsService.addMessage("Server",{message:"Application Works"}, "success");
      this.logsService.addMessage("Test",{message:"Application Works"}, "success");
      this.logsService.addMessage("Server-Log",{message:"Application Works"}, "success");

      //this.logsService.addMessage("insert-fact",{"id":0,"name":"Command","attributes":[{"id":0,"name":"client","type":"defaultpkg.Custom","enumValues":null},{"id":1,"name":"order","type":"defaultpkg.Orders","enumValues":null}]}, "info");

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

    debug(searchField : string){
        console.log(searchField);
    }

    transform(messages: Message[], field: string, value: string) {
        return(this.logsService.transform(messages, field, value));
    }

    onClear(){
        this.logsService.clearLogs();
    }

  ngOnInit() {

      this.messagesSubscription = this.logsService.messagesSubject.subscribe(
          (messages: Message[]) => {
              this.messages = messages;
          }
      );
      this.logsService.emitMessagesSubject();
      this.searchFields = this.logsService.messageFields;
  }

  ngOnDestroy(){
      this.messagesSubscription.unsubscribe();
  }

}
