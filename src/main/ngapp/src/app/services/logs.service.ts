import { Injectable } from '@angular/core';
import {Message} from "../models/message.model";
import {Subject} from "rxjs/index";

@Injectable({
  providedIn: 'root'
})
export class LogsService {
    public stringOfMessages: string = '';
    stringOfMessagesSubject = new Subject<string>(); // We use a Subject to set the variable DrlCode Private

    private messages: Message[]= [] ;
    messagesSubject = new Subject<object>(); // We use a Subject to set the variable DrlCode Private

    public message: Message = new Message(-1, new Date(),"test", {}, "black");

    public messageFields = ['id', 'date', 'type', 'message'];

    private idMesssage: number = 0;


  constructor() { }

    emitMessagesSubject() {
        this.messagesSubject.next(this.messages);
    }

    emitStringOfMessagesSubject() {
        this.stringOfMessagesSubject.next(this.stringOfMessages);
    }



  addMessage(type:string, messageSent:object, level:string) {
      let  message: Message = new Message(-1,new Date(),type, {}, "black");
      message.id = this.messages.length;
    message.date = new Date();
    message.message = JSON.stringify(messageSent);
    message.level = level;
    message.type = type;
    this.messages.unshift(message);
    console.log(this.messages);
      this.emitMessagesSubject();
  }

    transform(messages: Message[], field: string, value: string) {
        if (!messages) {
            return [];
        }
        if (!field || !value) {
            return messages;
        }
        return messages.filter(message => this.transformMessage(message, field, value)


        );
    }

    transformMessage(message, field, value){
        if (typeof(message[field]) === 'string'){
            return(message[field].toLowerCase().includes(value.toLowerCase()));
        }
        else if (typeof(message[field]) === 'object' && message[field].JSON ){
            return(message[field].JSON.stringify.toLowerCase().includes(value.toLowerCase()));
        }
        else {
            console.log(message[field].toString().toLowerCase());
            return(message[field].toString().toLowerCase().includes(value.toString().toLowerCase()));
        }
    }

    clearLogs(){
        this.messages = [];
        //this.addMessage('Log-cleared', {message : 'Log cleared'}, 'success')
        this.emitMessagesSubject();
    }

}
