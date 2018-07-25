import {Component, OnInit, ViewChild} from '@angular/core';
import { JsonSchemaFormComponent, JsonSchemaFormModule } from 'angular2-json-schema-form';
import {FactsService} from '../../services/facts.service';
import {Subscription} from "rxjs/internal/Subscription";
import {DRLService} from "../../services/drl.service";



/* This Component Displays the Facts. It uses the json-schema form library for Angular 6.
You can check how to install it here : https://www.npmjs.com/package/angular2-json-schema-form
And this app uses the Bootstrap3FrameworkModule included in JsonSchemaFormModule */

@Component({
  selector: 'app-facts',
  templateUrl: './facts.component.html',
  styleUrls: ['./facts.component.scss']
})
export class FactsComponent implements OnInit {

    editor : any;

    event: any = {};

  myFormData: object ={"schema":{"Facts":{"type":"array","items":[{}/*{"title":"Fact","type":"object","properties":{"value":{"title":"value","type":"integer","properties":{}}}}*/]}}};
  myFormDataSubscription: Subscription;
  test = JSON.stringify(this.myFormData);


    jsonEditorOptions = {
        iconlib: 'FontAwesome',
        theme: 'bootstrap3'
    };

    jsonSchema = {"title":"Facts","type":"object","properties":{}};
    jsonSchemaSubscription :Subscription;


  constructor(private factService: FactsService, private drlService: DRLService) {


  }

  ngOnInit() {
      this.jsonSchemaSubscription = this.factService.myFormDataSubject.subscribe(
          (jsonSchema: any ) => {
              this.jsonSchema = jsonSchema;
          }
      );
  }

  onSubmitEvent(event) {

    this.event = event;
    console.log('hello',event);
    this.drlService.submit(event);
    console.log(this.jsonSchema);
  }

    ngOnDestroy() {
        this.jsonSchemaSubscription.unsubscribe();
    }

}
