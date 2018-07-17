import {Component, OnInit, ViewChild} from '@angular/core';
import { JsonSchemaFormComponent, JsonSchemaFormModule } from 'angular2-json-schema-form';
import {EventsService} from '../../services/events.service';
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

    event: any = {};

  myFormData: object ={"schema":{"Facts":{"type":"array","items":[{}/*{"title":"Fact","type":"object","properties":{"value":{"title":"value","type":"integer","properties":{}}}}*/]}}};
  myFormDataSubscription: Subscription;
  test = JSON.stringify(this.myFormData);


  constructor(private factService: FactsService, private drlService: DRLService) {


  }

  ngOnInit() {
      this.myFormDataSubscription = this.factService.myFormDataSubject.subscribe(
          (myFormData: object) => {
              this.myFormData = myFormData;
          }
      );
  }

  onSubmitEvent(event) {
    this.event = event;
    console.log('hello',event);
    this.drlService.submit(event);
  }

    ngOnDestroy() {
        this.myFormDataSubscription.unsubscribe();
    }

}
