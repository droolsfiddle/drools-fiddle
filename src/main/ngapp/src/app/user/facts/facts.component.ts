import {Component, OnInit, ViewChild} from '@angular/core';
import { JsonSchemaFormComponent, JsonSchemaFormModule } from 'angular2-json-schema-form';
import {EventsService} from '../../services/events.service';
import {FactsService} from '../../services/facts.service';

/* This Component Displays the Facts. It uses the json-schema form library for Angular 6.
You can check how to install it here : https://www.npmjs.com/package/angular2-json-schema-form
And this app uses the Bootstrap3FrameworkModule included in JsonSchemaFormModule */

@Component({
  selector: 'app-facts',
  templateUrl: './facts.component.html',
  styleUrls: ['./facts.component.scss']
})
export class FactsComponent implements OnInit {


  myFormData = this.factService.myFormData;
  test = JSON.stringify(this.myFormData);


  constructor(private factService: FactsService) {

  }

  ngOnInit() {
  }

}
