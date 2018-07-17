import {StepFunctionsService} from "./step-functions.service";
import {Injectable} from "@angular/core";

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}



function displayMessage(data) {
    console.log(data);
    /* const message = document.getElementById('log');
    message.value = data + "\n" + message.value; */ // LOGS
}


/*
(function bar(){


    websocket = createWebSocket('websocket/log');


    websocket.onopen = function () {
        console.log('Opened');
        displayMessage('Connection is now open.');
        this.send('Test');
    };

    websocket.onmessage = function (event) {
        if (event['data'] == 'pong') {
            console.log('keep-alive: Pong!');
            return "pong";
        }
        // log the event
        console.log("event", event);
        displayMessage(event['data']);
        if (IsJsonString(event['data'])) {
            const jsonObject = JSON.parse(event['data']);
            console.log("jsonObject", jsonObject);
            console.log(event['data']);
            if (jsonObject['action'] != null) {
                actionHandle(jsonObject['action'], jsonObject);
                console.log("heeeello",jsonObject['action']);
            }
        }
    };

    websocket.onerror = function (event) {
        // log the event
        displayMessage('Error! ' + event.data);
    };

    websocket.onclose = function () {
        console.log('Closed');
        displayMessage('The connection was closed or timed out.');
    };

    window.setInterval(function () {
        websocket.send('ping');
        console.log('Sent');
    }, 10000);
    return "Success";

}()); */



 @Injectable({
    providedIn: 'root'
})
export class SocketService {

     protocolPrefix = (window.location.protocol === 'https:') ? 'wss:' : 'ws:';
     port = window.location.port ? ":"+window.location.port : "";


  constructor(private  stepFunctionService: StepFunctionsService) {
      let _this = this;

      let websocket = new WebSocket(this.protocolPrefix + '//' + window.location.hostname + this.port + "/" + 'websocket/log');

      websocket.onopen = function () {
          console.log('Opened');
          displayMessage('Connection is now open.');
          this.send('Test');
      };
      websocket.onmessage = function (event) {
          if (event['data'] == 'pong') {
              console.log('keep-alive: Pong!');
              return "pong";
          }
          // log the event
          console.log("event", event);
          displayMessage(event['data']);
          if (IsJsonString(event['data'])) {
              const jsonObject = JSON.parse(event['data']);
              console.log("jsonObject", jsonObject);
              console.log(event['data']);
              if (jsonObject['action'] != null) {
                  _this.stepFunctionService.actionHandle(jsonObject['action'], jsonObject);
                  console.log("heeeello",jsonObject['action']);
              }
          }
      };

      websocket.onerror = function (event) {
          // log the event
          displayMessage('Error! ' + event['data']);
      };

      websocket.onclose = function () {
          console.log('Closed');
          displayMessage('The connection was closed or timed out.');
      };

      window.setInterval(function () {
          websocket.send('ping');
          console.log('Sent');
      }, 10000);
  }

}
