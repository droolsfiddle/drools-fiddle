import { Injectable } from '@angular/core';
import {Subject} from "rxjs/index";

/* This Service will manage the facts */

declare var JSONEditor;

@Injectable({
  providedIn: 'root'
})
export class FactsService {

     /* myFormData = {"schema":{"Facts":{"type":"array","items":[{}{"title":"Fact","type":"object","properties":{"value":{"title":"value","type":"integer","properties":{}}}}]}}} */
    myFormData = {"title":"Facts","type":"object","properties":{}};

    myFormDataSubject = new Subject<object>(); // We use a Subject to set the variable DrlCode Private


  constructor() {

  }

    emitMyFormDataSubject() {
        this.myFormDataSubject.next(this.myFormData);
    }





}
