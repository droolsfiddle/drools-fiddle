import {Component, OnInit} from '@angular/core';
import {FactsService} from '../../services/facts.service';
import {Subscription} from "rxjs/internal/Subscription";


/* This Component Displays the Facts. It uses the json-schema form library for Angular 6.
You can check how to install it here : https://www.npmjs.com/package/angular2-json-schema-form
And this app uses the Bootstrap3FrameworkModule included in JsonSchemaFormModule */

@Component({
    selector: 'app-facts',
    templateUrl: './facts.component.html',
    styleUrls: ['./facts.component.scss']
})
export class FactsComponent implements OnInit {

    editor: any;

    event: any = {};


    jsonEditorOptions = {
        iconlib: 'FontAwesome',
        theme: 'bootstrap3'
    };

    jsonSchema = {};
    jsonSchemaSubscription: Subscription;

    jsonData = {};
    jsonDataSubscription: Subscription;

    constructor(private factService: FactsService) {


    }


    ngOnInit() {
        this.jsonSchemaSubscription = this.factService.myFormDataSubject.subscribe(
            (jsonSchema: any) => {
                this.jsonSchema = jsonSchema;
            }
        );
        this.factService.emitMyFormDataSubject();

        this.jsonDataSubscription = this.factService.jsonDataSubject.subscribe(
            (jsonData: any) => {
                this.jsonData = jsonData;
            }
        );
        this.factService.emitJsonDataSubject();
    }


    ngOnDestroy() {
        this.jsonSchemaSubscription.unsubscribe();
    }

}
