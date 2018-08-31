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

import javax.websocket.Session;
import java.io.IOException;

/**
 * Created by jvipret on 05/11/2016.
 */
public class WebSocketUtil {

  static private Logger logger = Logger.getLogger(WebSocketUtil.class);

  static public void sendToWebSocket(Session iSession, String iData) {
    try {
    	logger.debug("session  "+ iSession);
    	logger.debug("session getBasicRemote "+ iSession.getBasicRemote());
      iSession.getBasicRemote().sendText(iData);
    } catch (IOException e2) {
      logger.error("Websocket error",e2);
    }
  }
}
