import {Component, OnDestroy, OnInit} from '@angular/core';
import {Message} from "../models/message.model";
import {Subscription} from "rxjs/index";
import {LogsService} from "../services/logs.service";


/* This component displays the log screen */

@Component({
    selector: 'app-logs',
    templateUrl: './logs.component.html',
    styleUrls: ['./logs.component.scss'],
})

export class LogsComponent implements OnInit, OnDestroy {

    public messages: Message[];
    messagesSubscription: Subscription;

    public searchString: string[] = ['test', 'try'];
    public searchField: string = 'message';
    public searchFields: string[];

    public checkedMap = new Map<string, boolean>();

    public x = [5, 10, 25, 30];

    public map = new Map<string, string[]>();
    mapSubscription: Subscription;

    constructor( private logsService: LogsService) {
        // this.logsService.addMessage("Server-Log", {message: "Application Works"}, "success");
        // this.logsService.addMessage("Server-Log", {message: "Application Works"}, "debug");
        // this.logsService.addMessage("Log", {message: "Application Works"}, "danger");
        // this.logsService.addMessage("Server", {message: "Test"}, "info");
        // this.logsService.addMessage("Test", {message: "Application Works"}, "warning");
        // this.logsService.addMessage("Server-Log", {message: "Application Works"}, "success");

        this.checkedMap.set('success', true);
        this.checkedMap.set('debug', true);
        this.checkedMap.set('warning', true);
        this.checkedMap.set('info', true);
        this.checkedMap.set('danger', true);

        //this.logsService.addMessage("insert-fact",{"id":0,"name":"Command","attributes":[{"id":0,"name":"client","type":"defaultpkg.Custom","enumValues":null},{"id":1,"name":"order","type":"defaultpkg.Orders","enumValues":null}]}, "info");

    }

    changeChecked(level: string) {
        this.checkedMap.set(level, !this.checkedMap.get(level));
    }

    getLevel(level: string) {
        return (this.checkedMap.get(level));
    }

    addMap(K: string, V: string) {
        this.logsService.addLogsMap(K, V);
    }

    popMap(K: string, V: string) {
        this.logsService.popLogsMap(K, V);
    }

    getMap(K: string) {
        return (this.logsService.getLogsMap(K));

    }

    changeLevel(level: string) {
        if (this.checkedMap.get(level)) {
            this.addMap('level', level);
        }
        else {
            this.popMap('level', level);
        }
    }


    selectAll() {
        for (let key of Array.from(this.checkedMap.keys())) {
            this.checkedMap.set(key, true);
            this.addMap('level', key);
        }
    }

    selectNone() {
        for (let key of Array.from(this.checkedMap.keys())) {
            this.checkedMap.set(key, false);
            this.popMap('level', key);
        }
    }


    getColor(level: string) {
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

    transform(messages: Message[]) {
        return (this.logsService.transform(messages, this.map));
    }

    onClear() {
        this.logsService.clearLogs();
    }

    ngOnInit() {

        this.messagesSubscription = this.logsService.messagesSubject.subscribe(
            (messages: Message[]) => {
                this.messages = messages;
            }
        );
        this.logsService.emitMessagesSubject();

        this.mapSubscription = this.logsService.logsMapSubject.subscribe(
            (map: Map<string, string[]>) => {
                this.map = map;
            }
        );
        this.logsService.emitLogsMapSubject();

        this.searchFields = this.logsService.messageFields;
    }

    ngOnDestroy() {
        this.messagesSubscription.unsubscribe();
        this.mapSubscription.unsubscribe();
    }

}
