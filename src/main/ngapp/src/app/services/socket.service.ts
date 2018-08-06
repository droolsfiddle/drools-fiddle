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
    port = window.location.port ? ":" + window.location.port : "";


    constructor(private  stepFunctionService: StepFunctionsService, private logService: LogsService) {
        let _this = this;

        let websocket = new WebSocket(this.protocolPrefix + '//' + window.location.hostname + this.port + "/" + 'websocket/log');

        websocket.onopen = function () {
            console.log('Opened');
            let message = {message: 'Connection is now open.'};
            _this.displayMessage(message, "success", 'Server-log');
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

                if (jsonObject['action'] != null) {
                    _this.stepFunctionService.actionHandle(jsonObject['action'], jsonObject);
                    if (jsonObject['level'] != null) {
                        _this.displayMessage(jsonObject, jsonObject['level'], jsonObject['action']);
                    }
                    else {
                        _this.displayMessage(jsonObject, "info", jsonObject['action']);
                    }
                }
                else {
                    _this.displayMessage(jsonObject, "danger", 'Error');
                }
            }
            else {
                _this.displayMessage(event['data'], "success", 'Other');
            }
        };

        websocket.onerror = function (event) {
            // log the event
            let message = 'Error! ' + event['data'];
            _this.displayMessage(message, "danger", "Error");
        };

        websocket.onclose = function () {
            console.log('Closed');
            let message = {message: 'The connection was closed or timed out.'};
            _this.displayMessage(message, "warning", "Server-log");
        };

        window.setInterval(function () {
            websocket.send('ping');
            console.log('Sent');
        }, 10000);
    }

    displayMessage(data, level: string, type: string) {
        this.logService.addMessage(type, data, level);
    }

}
