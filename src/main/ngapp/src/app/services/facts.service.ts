import { Injectable } from '@angular/core';

/* This Service will manage the facts */

@Injectable({
  providedIn: 'root'
})
export class FactsService {
  
    myFormData = {
        'schema': {
            'Facts': {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'title': 'Fact',
                    'properties': {
                        'value': {
                            'type': 'integer',
                            'title': 'Value',
                            'required': true
                        },
                        'value2': {
                            'type': 'string',
                            'title': 'Test',
                        }
                    }
                }
            }
        }
    }

  constructor() { }
}
