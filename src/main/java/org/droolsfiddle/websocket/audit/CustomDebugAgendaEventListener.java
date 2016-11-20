package org.droolsfiddle.websocket.audit;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.droolsfiddle.websocket.CustomDroolsEvent;
import org.droolsfiddle.websocket.WebSocketUtil;
import org.kie.api.event.rule.*;

import javax.websocket.Session;
import java.io.IOException;

/**
 * Created by jvipret on 23/07/2016.
 */
public class CustomDebugAgendaEventListener extends DebugAgendaEventListener {

  private Session wsSession;
  private ObjectMapper mapper = new ObjectMapper();


  public CustomDebugAgendaEventListener(Session iSession) {
    super();
    wsSession = iSession;
  }


  public void matchCancelled(MatchCancelledEvent event) {
    super.matchCancelled(event);
  }

  public void matchCreated(MatchCreatedEvent event) {
    super.matchCreated(event);
  }

  public void afterMatchFired(AfterMatchFiredEvent event) {
    super.afterMatchFired(event);
  }

  public void agendaGroupPopped(AgendaGroupPoppedEvent event) {
    super.agendaGroupPopped(event);
  }

  public void agendaGroupPushed(AgendaGroupPushedEvent event) {
    super.agendaGroupPushed(event);
  }

  public void beforeMatchFired(BeforeMatchFiredEvent event) {
    super.beforeMatchFired(event);
    try{
      CustomDroolsEvent aEvent = new CustomDroolsEvent("fire").map(event);
      WebSocketUtil.sendToWebSocket(wsSession, mapper.writeValueAsString(aEvent));
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  public void beforeRuleFlowGroupActivated(RuleFlowGroupActivatedEvent event) {
    super.beforeRuleFlowGroupActivated(event);
  }

  public void afterRuleFlowGroupActivated(RuleFlowGroupActivatedEvent event) {
    super.afterRuleFlowGroupActivated(event);
  }

  public void beforeRuleFlowGroupDeactivated(RuleFlowGroupDeactivatedEvent event) {
    super.beforeRuleFlowGroupDeactivated(event);
  }

  public void afterRuleFlowGroupDeactivated(RuleFlowGroupDeactivatedEvent event) {
    super.afterRuleFlowGroupDeactivated(event);
  }
}
