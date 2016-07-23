package com.rest.audit;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rest.CustomDroolsEvent;
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
//    try {
//      wsSession.getBasicRemote().sendText(event.toString());
//    } catch (IOException e) {
//      e.printStackTrace();
//    }
  }

  public void matchCreated(MatchCreatedEvent event) {
    super.matchCreated(event);
//    try {
//      CustomDroolsEvent aEvent = new CustomDroolsEvent("fire").map(event);
//      wsSession.getBasicRemote().sendText(mapper.writeValueAsString(aEvent));
//    } catch (IOException e) {
//      e.printStackTrace();
//    }
  }

  public void afterMatchFired(AfterMatchFiredEvent event) {
    super.afterMatchFired(event);
//    try {
//    CustomDroolsEvent aEvent = new CustomDroolsEvent("fire").map(event);
//    wsSession.getBasicRemote().sendText(mapper.writeValueAsString(aEvent));
//    } catch (IOException e) {
//      e.printStackTrace();
//    }
  }

  public void agendaGroupPopped(AgendaGroupPoppedEvent event) {
    super.agendaGroupPopped(event);
//    try {
//      wsSession.getBasicRemote().sendText(event.toString());
//    } catch (IOException e) {
//      e.printStackTrace();
//    }
  }

  public void agendaGroupPushed(AgendaGroupPushedEvent event) {
    super.agendaGroupPushed(event);
//    try {
//      wsSession.getBasicRemote().sendText(event.toString());
//    } catch (IOException e) {
//      e.printStackTrace();
//    }
  }

  public void beforeMatchFired(BeforeMatchFiredEvent event) {
    super.beforeMatchFired(event);
    try{
      CustomDroolsEvent aEvent = new CustomDroolsEvent("fire").map(event);
      wsSession.getBasicRemote().sendText(mapper.writeValueAsString(aEvent));
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  public void beforeRuleFlowGroupActivated(RuleFlowGroupActivatedEvent event) {
    super.beforeRuleFlowGroupActivated(event);
//    try {
//      wsSession.getBasicRemote().sendText(event.toString());
//    } catch (IOException e) {
//      e.printStackTrace();
//    }
  }

  public void afterRuleFlowGroupActivated(RuleFlowGroupActivatedEvent event) {
    super.afterRuleFlowGroupActivated(event);
//    try {
//      wsSession.getBasicRemote().sendText(event.toString());
//    } catch (IOException e) {
//      e.printStackTrace();
//    }
  }

  public void beforeRuleFlowGroupDeactivated(RuleFlowGroupDeactivatedEvent event) {
    super.beforeRuleFlowGroupDeactivated(event);
//    try {
//      wsSession.getBasicRemote().sendText(event.toString());
//    } catch (IOException e) {
//      e.printStackTrace();
//    }
  }

  public void afterRuleFlowGroupDeactivated(RuleFlowGroupDeactivatedEvent event) {
    super.afterRuleFlowGroupDeactivated(event);
//    try {
//      wsSession.getBasicRemote().sendText(event.toString());
//    } catch (IOException e) {
//      e.printStackTrace();
//    }
  }
}
