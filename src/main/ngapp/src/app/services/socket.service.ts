import {StepFunctionsService} from "./step-functions.service";
import {Injectable} from "@angular/core";
import {LogsService} from "./logs.service";

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}







 @Injectable({
    providedIn: 'root'
})
export class SocketService {

     protocolPrefix = (window.location.protocol === 'https:') ? 'wss:' : 'ws:';
     port = window.location.port ? ":"+window.location.port : "";


  constructor(private  stepFunctionService: StepFunctionsService, private logService: LogsService ) {
      let _this = this;

      let websocket = new WebSocket(this.protocolPrefix + '//' + window.location.hostname + this.port + "/" + 'websocket/log');

      websocket.onopen = function () {
          console.log('Opened');
          _this.displayMessage('Connection is now open.');
          this.send('Test');
      };
      websocket.onmessage = function (event) {
          if (event['data'] == 'pong') {
              console.log('keep-alive: Pong!');
              return "pong";
          }
          // log the event
          console.log("event", event);
          if (IsJsonString(event['data'])) {
              const jsonObject = JSON.parse(event['data']);
              _this.displayMessage(jsonObject);
              console.log("jsonObject", jsonObject);
              console.log(event['data']);
              if (jsonObject['action'] != null) {
                  _this.stepFunctionService.actionHandle(jsonObject['action'], jsonObject);
                  console.log("heeeello",jsonObject['action']);
              }
          }
          else{
              _this.displayMessage(event['data']);
          }
      };

      websocket.onerror = function (event) {
          // log the event
          _this.displayMessage('Error! ' + event['data']);
      };

      websocket.onclose = function () {
          console.log('Closed');
          _this.displayMessage('The connection was closed or timed out.');
      };

      window.setInterval(function () {
          websocket.send('ping');
          console.log('Sent');
      }, 10000);
  }

     displayMessage(data) {
         console.log(data);
         this.logService.addMessage(data);
         /* const message = document.getElementById('log');
         message.value = data + "\n" + message.value; */ // LOG
     }

}
