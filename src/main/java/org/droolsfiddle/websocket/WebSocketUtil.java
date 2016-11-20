package org.droolsfiddle.websocket;

import org.jboss.resteasy.logging.Logger;

import javax.websocket.Session;
import java.io.IOException;

/**
 * Created by jvipret on 05/11/2016.
 */
public class WebSocketUtil {

  static private Logger logger = Logger.getLogger(WebSocketUtil.class);

  static public void sendToWebSocket(Session iSession, String iData) {
    try {
      iSession.getBasicRemote().sendText(iData);
    } catch (IOException e2) {
      logger.error("Websocket error",e2);
    }
  }
}
