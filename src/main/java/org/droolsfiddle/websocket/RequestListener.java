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