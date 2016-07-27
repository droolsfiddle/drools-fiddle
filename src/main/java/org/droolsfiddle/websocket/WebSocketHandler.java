package org.droolsfiddle.websocket;

/**
 * Created by jvipret on 18/07/2016.
 */


import org.jboss.resteasy.logging.Logger;

import javax.servlet.http.HttpSession;
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint(value = "/websocket/log", configurator = GetHttpSessionConfigurator.class)
public class WebSocketHandler {

  private Logger logger = Logger.getLogger(WebSocketHandler.class);


  @OnMessage
  public String echo(String name) {
    System.out.println("Say hello to '" + name + "'");
    return ("Hello " + name + " from websocket endpoint");
  }

  @OnOpen
  public void open(Session session, EndpointConfig config) {

    HttpSession aHttpSession = (HttpSession) config.getUserProperties().get(HttpSession.class.getName());
    logger.debug("session id: " + aHttpSession.getId());

    aHttpSession.setAttribute(Session.class.getName(), session);

//    drlContext.setWebSocketSession(session);
    System.out.println("WebSocket opened: " + session.getId());
  }

  @OnClose
  public void close(CloseReason reason) {
    System.out.println("WebSocket connection closed with CloseCode: " + reason.getCloseCode());
  }
}