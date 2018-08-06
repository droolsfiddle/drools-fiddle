import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Message} from "../../models/message.model";
import {LogsService} from "../../services/logs.service";
import {Subscription} from "rxjs/index";

@Component({
    selector: 'app-multiselect',
    templateUrl: './multiselect.component.html',
    styleUrls: ['./multiselect.component.scss']
})
export class MultiselectComponent implements OnInit, OnChanges, OnDestroy {

    //@Input() messages;

    dropdownList = [];
    selectedItems = [];
    dropdownSettings = {};
    public messages: Message[];
    messagesSubscription: Subscription;

    constructor(private logsService: LogsService) {
    }

    constructDropDownList(messages: Message[]) {
        let listOfTypes: string[] = [];
        for (let message of messages) {
            if (!(listOfTypes.indexOf(message['type']) > -1)) {
                listOfTypes.push(message['type']);
            }
        }
        this.dropdownList = [];
        listOfTypes.forEach((item, index) => {
            this.dropdownList.push({item_id: index + 1, item_text: item})
        });
    }

    ngOnInit() {
        this.messagesSubscription = this.logsService.messagesSubject.subscribe(
            (messages: Message[]) => {
                this.messages = messages;
                this.constructDropDownList(messages);
                this.deselectAll(this.dropdownList);
                this.onSelectAll(this.dropdownList);
                this.selectedItems = this.dropdownList;
            }
        );
        this.logsService.emitMessagesSubject();
        this.constructDropDownList(this.messages);
        /* this.dropdownList = [
            { item_id: 1, item_text: 'Mumbai' },
            { item_id: 2, item_text: 'Bangaluru' },
            { item_id: 3, item_text: 'Pune' },
            { item_id: 4, item_text: 'Navsari' },
            { item_id: 5, item_text: 'New Delhi' }
        ]; */
        this.selectedItems = this.dropdownList;
        this.onSelectAll(this.dropdownList);
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            //itemsShowLimit: 3,
            allowSearchFilter: true
        };

    }

    ngOnDestroy() {
        this.messagesSubscription.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges) {
        /*if (!!changes['messages'] && changes['messages'].currentValue != null) {

        } */
        this.constructDropDownList(changes.messages.currentValue);
    }

    selectAll(items: any) {
        for (let key of items) {
            this.addMap('type', key['item_text']);
        }
    }

    deselectAll(items: any) {
        for (let key of items) {
            this.popMap('type', key['item_text']);
        }

    }


    addMap(K: string, V: string) {
        this.logsService.addLogsMap(K, V);
    }

    popMap(K: string, V: string) {
        this.logsService.popLogsMap(K, V);
    }

    onItemSelect(item: any) {
        this.addMap('type', item['item_text']);
    }

    onItemDeselect(item: any) {
        this.popMap('type', item['item_text']);
    }


    onSelectAll(items: any) {
        this.dropdownList = items;
        this.selectAll(items)
    }

    onDeselectAll(items: any) {
        this.deselectAll(this.dropdownList);
    }
}
