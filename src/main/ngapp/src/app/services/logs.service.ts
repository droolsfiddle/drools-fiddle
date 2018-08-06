import {Injectable} from '@angular/core';
import {Message} from "../models/message.model";
import {Subject} from "rxjs/index";

@Injectable({
    providedIn: 'root'
})
export class LogsService {
    public stringOfMessages: string = '';
    stringOfMessagesSubject = new Subject<string>(); // We use a Subject to set the variable DrlCode Private
    messagesSubject = new Subject<object>(); // We use a Subject to set the variable DrlCode Private
    public message: Message = new Message(-1, new Date(), "test", {}, "black");
    logsMapSubject = new Subject<Map<string, string[]>>(); // We use a Subject to set the variable DrlCode Private
    public messageFields = ['id', 'date', 'message'];
    private messages: Message[] = [];
    private logsMap = new Map<string, string[]>();
    private idMesssage: number = 0;


    constructor() {
        this.logsMap.set('level', ['success', 'danger', 'debug', 'warning', 'info']);
        this.logsMap.set('id', ['']);
        this.logsMap.set('date', ['']);
        this.logsMap.set('type', []);
        this.logsMap.set('message', ['']);
    }

    static deleteList(value: string, list: string[]) {
        const index: number = list.indexOf(value);
        if (index !== -1) {
            list.splice(index, 1);
        }
    }

    emitMessagesSubject() {
        this.messagesSubject.next(this.messages);
    }

    emitLogsMapSubject() {
        this.logsMapSubject.next(this.logsMap);
    }

    emitStringOfMessagesSubject() {
        this.stringOfMessagesSubject.next(this.stringOfMessages);
    }

    addLogsMap(K: string, V: string) {
        if (this.logsMap.get(K) && !this.logsMap.get(K).includes(V)) {
            this.logsMap.get(K).push(V);
        }
        this.emitLogsMapSubject();
    }

    popLogsMap(K: string, V: string) {
        if (this.logsMap.get(K) && this.logsMap.get(K).includes(V)) {
            LogsService.deleteList(V, this.logsMap.get(K));
        }
        this.emitLogsMapSubject();
    }

    getLogsMap(K: string) {
        return (this.logsMap.get(K));
    }

    addMessage(type: string, messageSent: object, level: string) {
        let message: Message = new Message(-1, new Date(), type, {}, "black");
        message.id = this.messages.length;
        message.date = new Date();
        message.message = JSON.stringify(messageSent);
        message.level = level;
        message.type = type;
        this.messages.unshift(message);
        this.emitMessagesSubject();
    }

    transform(messages: Message[], map: Map<string, string[]>) {
        let listMessage: Message[] = [];
        if (!messages) {
            return [];
        }
        if (!map.keys() || !map.values()) {
            return messages;
        }


        listMessage = listMessage.concat(messages.filter(message => this.transformMessage(message, map)));
        this.emitLogsMapSubject();

        return listMessage;
    }


    transformMessage(message, map: Map<string, string[]>) {
        let resultFinal = true;
        for (let field of Array.from(map.keys())) {
            let result = false;
            if (field != 'type') {
                for (let value of this.getLogsMap(field)) {
                    if (typeof(message[field]) === 'string') {
                        result = result || message[field].toLowerCase().includes(value.toLowerCase());
                    }
                    else if (typeof(message[field]) === 'object' && message[field].JSON) {
                        result = result || message[field].JSON.stringify.toLowerCase().includes(value.toLowerCase());
                    }
                    else {
                        result = result || message[field].toString().toLowerCase().includes(value.toString().toLowerCase());
                    }
                }
            }
            else {
                for (let value of this.getLogsMap(field)) {
                    if (typeof(message[field]) === 'string') {
                        result = result || message[field].toLowerCase() === value.toLowerCase();
                    }
                    else if (typeof(message[field]) === 'object' && message[field].JSON) {
                        result = result || message[field].JSON.stringify.toLowerCase() === value.toLowerCase();
                    }
                    else {
                        result = result || message[field].toString().toLowerCase() === value.toString().toLowerCase();
                    }
                }
            }
            resultFinal = resultFinal && result;
        }
        return resultFinal;
    }

    clearLogs() {
        this.messages = [];
        //this.addMessage('Log-cleared', {message : 'Log cleared'}, 'success')
        this.emitMessagesSubject();
    }

}
