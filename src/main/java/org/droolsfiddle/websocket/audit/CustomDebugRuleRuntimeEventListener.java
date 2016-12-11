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

package org.droolsfiddle.websocket.audit;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.droolsfiddle.websocket.CustomDroolsEvent;
import org.droolsfiddle.websocket.WebSocketUtil;
import org.kie.api.event.rule.DebugRuleRuntimeEventListener;
import org.kie.api.event.rule.ObjectDeletedEvent;
import org.kie.api.event.rule.ObjectInsertedEvent;
import org.kie.api.event.rule.ObjectUpdatedEvent;

import javax.websocket.Session;
import java.io.IOException;

/**
 * Created by jvipret on 20/07/2016.
 */
public class CustomDebugRuleRuntimeEventListener extends DebugRuleRuntimeEventListener {

  private Session wsSession;
  private ObjectMapper mapper = new ObjectMapper();


  public CustomDebugRuleRuntimeEventListener(Session iSession) {
    super();
    wsSession = iSession;
  }

  public void objectInserted(ObjectInsertedEvent event) {
    super.objectInserted(event);
    try {
      CustomDroolsEvent aEvent = new CustomDroolsEvent("insert-fact").map(event);
      WebSocketUtil.sendToWebSocket(wsSession, mapper.writeValueAsString(aEvent));
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  public void objectDeleted(ObjectDeletedEvent event) {

    super.objectDeleted(event);
    try {
      CustomDroolsEvent aEvent = new CustomDroolsEvent("delete-fact").map(event);
      WebSocketUtil.sendToWebSocket(wsSession, mapper.writeValueAsString(aEvent));
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  public void objectUpdated(ObjectUpdatedEvent event) {
  super.objectUpdated(event);
  try {
    CustomDroolsEvent aEvent = new CustomDroolsEvent("update-fact").map(event);
    WebSocketUtil.sendToWebSocket(wsSession, mapper.writeValueAsString(aEvent));
  } catch (IOException e) {
    e.printStackTrace();
  }  }

}
