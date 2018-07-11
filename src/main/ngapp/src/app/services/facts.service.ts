import { Injectable } from '@angular/core';

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
     myFormData = {"schema":{"Facts":{"type":"array","items":[{"title":"Fact","type":"object","properties":{"value":{"title":"value","type":"integer","properties":{}}}}]}}}
    /*
    myFormData = {
        'schema': {
            "title":"Facts",
            "type":"object",
            "properties":{
                "Fact":{
                    "title":"Fact",
                    "type":"object",
                    "properties":{
                        "value":{
                            "title":"value",
                            "type":"integer",
                        }

                    }

                },
                "Fact2":{
                    "title":"Fact2",
                    "type":"object",
                    "properties":{
                        "value":{
                            "title":"value",
                            "type":"integer",
                        }

                    }

                }

            }

        }

    } */

  constructor() { }
}
