package org.droolsfiddle.websocket.audit;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.droolsfiddle.websocket.CustomDroolsEvent;
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
      wsSession.getBasicRemote().sendText(mapper.writeValueAsString(aEvent));
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  public void objectDeleted(ObjectDeletedEvent event) {

    super.objectDeleted(event);
    try {
      CustomDroolsEvent aEvent = new CustomDroolsEvent("delete-fact").map(event);
      wsSession.getBasicRemote().sendText(mapper.writeValueAsString(aEvent));
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  public void objectUpdated(ObjectUpdatedEvent event) {
  super.objectUpdated(event);
  try {
    CustomDroolsEvent aEvent = new CustomDroolsEvent("update-fact").map(event);
    wsSession.getBasicRemote().sendText(mapper.writeValueAsString(aEvent));
  } catch (IOException e) {
    e.printStackTrace();
  }  }

}
