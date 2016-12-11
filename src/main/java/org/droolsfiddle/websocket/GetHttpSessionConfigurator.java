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
	try {
      HttpSession httpSession = (HttpSession)request.getHttpSession();
      config.getUserProperties().put(HttpSession.class.getName(),httpSession);
	} catch(Exception e) {
		logger.error("Exception caught while trying to bind HTTP session to WS session.",e);
	}
  }
}