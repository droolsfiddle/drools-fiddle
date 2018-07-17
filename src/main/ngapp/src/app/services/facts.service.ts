import { Injectable } from '@angular/core';
import {Subject} from "rxjs/index";

/* This Service will manage the facts */

@Injectable({
  providedIn: 'root'
})
export class FactsService {

    /*
    myFormData = {
        'schema': {
            'Facts': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'title': 'Fact',
                    'properties': {
                        'Hey': {
                            'type': 'object',
                            'title': 'Value',
                            'properties':{
                                'Try': {
                                    'type': 'integer',
                                    'title': 'Test',
                                }
                            }
                        },

                        'value2': {
                            'type': 'string',
                            'title': 'Test',
                        }
                    }
                }
            }
        }
    };*/
     myFormData = {"schema":{"Facts":{"type":"array","items":[{}/*{"title":"Fact","type":"object","properties":{"value":{"title":"value","type":"integer","properties":{}}}}*/]}}};

    myFormDataSubject = new Subject<object>(); // We use a Subject to set the variable DrlCode Private


  constructor() {

  }

    emitMyFormDataSubject() {
        this.myFormDataSubject.next(this.myFormData);
    }


}
