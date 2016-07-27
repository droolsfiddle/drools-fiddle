package org.droolsfiddle.websocket;

import org.jboss.resteasy.logging.Logger;

import javax.servlet.http.HttpSession;
import javax.websocket.HandshakeResponse;
import javax.websocket.server.HandshakeRequest;
import javax.websocket.server.ServerEndpointConfig;

/**
 * Created by jvipret on 20/07/2016.
 */

public class GetHttpSessionConfigurator extends ServerEndpointConfig.Configurator
{

  private Logger logger = Logger.getLogger(GetHttpSessionConfigurator.class);


  @Override
  public void modifyHandshake(ServerEndpointConfig config,
                              HandshakeRequest request,
                              HandshakeResponse response)
  {
    HttpSession httpSession = (HttpSession)request.getHttpSession();
    logger.debug("session id: " + httpSession.getId());
    config.getUserProperties().put(HttpSession.class.getName(),httpSession);
  }
}