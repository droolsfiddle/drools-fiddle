package org.droolsfiddle.websocket;

import org.jboss.resteasy.logging.Logger;

import javax.servlet.ServletRequestEvent;
import javax.servlet.ServletRequestListener;
import javax.servlet.annotation.WebListener;
import javax.servlet.http.HttpServletRequest;

/**
 * Created by jvipret on 20/07/2016.
 */

@WebListener
public class RequestListener implements ServletRequestListener {

  private Logger logger = Logger.getLogger(RequestListener.class);


  public void requestDestroyed(ServletRequestEvent sre) {}

  public void requestInitialized(ServletRequestEvent sre) {
    ((HttpServletRequest) sre.getServletRequest()).getSession();
  }

}