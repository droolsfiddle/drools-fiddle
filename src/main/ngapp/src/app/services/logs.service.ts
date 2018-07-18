import { Injectable } from '@angular/core';
import {Message} from "../models/message.model";
import {Subject} from "rxjs/index";

@Injectable({
  providedIn: 'root'
})
export class LogsService {
    public stringOfMessages: string = '';
    stringOfMessagesSubject = new Subject<string>(); // We use a Subject to set the variable DrlCode Private

    public messages: Message[]= [] ;
    messagesSubject = new Subject<object>(); // We use a Subject to set the variable DrlCode Private

    public message: Message = new Message(new Date().toLocaleTimeString(), "Hello");


  constructor() { }

    emitMessagesSubject() {
        this.messagesSubject.next(this.messages);
    }

    emitStringOfMessagesSubject() {
        this.stringOfMessagesSubject.next(this.stringOfMessages);
    }

  addMessage(messageSent) {
      let  message: Message = new Message(new Date().toLocaleTimeString(), "Hello");
    message.date = new Date().toLocaleTimeString();
    message.message =  JSON.stringify(messageSent, null, 4);
    this.messages.push(message);
    console.log(this.messages);
    this.stringOfMessages = message.date + ':' + message.message + '\n---------------------------------\n' + this.stringOfMessages;
      this.emitMessagesSubject();
      this.emitStringOfMessagesSubject();
  }
}
