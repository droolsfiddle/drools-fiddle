package org.droolsfiddle.utilities;

import javax.json.Json;
import javax.websocket.Session;

import org.droolsfiddle.rest.model.FactDTO;
import org.droolsfiddle.websocket.CustomDroolsEvent;
import org.droolsfiddle.websocket.WebSocketHandler;
import org.droolsfiddle.websocket.WebSocketUtil;
import org.jboss.resteasy.logging.Logger;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class WSLogger {


	private Session wsSession;

	public WSLogger(Session wsSession) {
		this.wsSession = wsSession;
	}

	private void log(String message, String level, String logType) throws JsonProcessingException {
		String json = Json.createObjectBuilder()
	            .add("message", message)
	            .add("action", logType)
	            .add("level", level)
	            .build()
	            .toString();
		WebSocketUtil.sendToWebSocket(wsSession, json);
	}
	
	public void error(String message) throws JsonProcessingException {
		log(message, "danger", "User-log-error");
	}
	public void info(String message) throws JsonProcessingException {
		log(message, "info", "User-log-info");
	}
	public void debug(String message) throws JsonProcessingException {
		log(message, "debug", "User-log-debug");
	}
	public void warn(String message) throws JsonProcessingException {
		log(message, "warning", "User-log-warn");
	}
}
