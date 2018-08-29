/*   Copyright 2016 Drools Fiddle

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

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
  public String ping(Session session, String message) {
      if (message.equalsIgnoreCase("ping")) {
          return ("pong");
      }
      return null;
  }

  @OnOpen
  public void open(Session session, EndpointConfig config) {
	try {
		HttpSession aHttpSession = (HttpSession) config.getUserProperties().get(HttpSession.class.getName());
		logger.debug("session id: " + aHttpSession.getId());

		aHttpSession.setAttribute(Session.class.getName(), session);

		//    drlContext.setWebSocketSession(session);
		logger.info("WebSocket opened: " + session.getId());
	} catch (Exception e) {
		logger.error("Exception caught while opening WebSocket.",e);
	}
  }

  @OnClose
  public void close(CloseReason reason) {
    logger.info("WebSocket connection closed with CloseCode: " + reason.getCloseCode());
  }
  
  @OnError
  public void error(Session session, Throwable t) {
      logger.error("Exception in websocket", t);
  }
  
}