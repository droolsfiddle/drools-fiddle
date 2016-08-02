package org.droolsfiddle.websocket;

import org.droolsfiddle.rest.Fact;
import org.kie.api.event.rule.BeforeMatchFiredEvent;
import org.kie.api.event.rule.ObjectDeletedEvent;
import org.kie.api.event.rule.ObjectInsertedEvent;
import org.kie.api.event.rule.ObjectUpdatedEvent;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by jvipret on 23/07/2016.
 */
public class CustomDroolsEvent {

  private String action;

  private String type;
  private String id;
  private java.lang.Object object;
  private List<String> from;

  public CustomDroolsEvent(String action) {
    this.action = action;
    this.from = new ArrayList<String>();
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getAction() {
    return action;
  }

  public void setAction(String action) {
    this.action = action;
  }

  public String getType() { return type; }

  public void setType(String type) { this.type = type; }

  public Object getObject() {
    return object;
  }

  public void setObject(Object object) {
    this.object = object;
  }

  public List<String> getFrom() {
    return from;
  }

  public void setFrom(List<String> from) {
    this.from = from;
  }

  public void addFrom(String from) {
    this.from.add(from);
  }

  public CustomDroolsEvent map(ObjectInsertedEvent iEvent) {
    setId(Integer.toString(iEvent.getObject().hashCode()));
    setObject(iEvent.getObject());
    setType(iEvent.getKieRuntime().getObject(iEvent.getFactHandle()).getClass().getSimpleName());

    if (iEvent.getRule() != null) {
      addFrom(iEvent.getRule().getName());
    }
    return this;
  }

  public CustomDroolsEvent map(ObjectUpdatedEvent iEvent) {
    setId(Integer.toString(iEvent.getObject().hashCode()));
    setObject(iEvent.getObject());
    setType(iEvent.getKieRuntime().getObject(iEvent.getFactHandle()).getClass().getSimpleName());
    if (iEvent.getRule() != null) {
      addFrom(iEvent.getRule().getName());
    }
    return this;
  }

  public CustomDroolsEvent map(ObjectDeletedEvent iEvent) {
    setId(Integer.toString(iEvent.getOldObject().hashCode()));
    setObject(iEvent.getOldObject());
    if (iEvent.getRule() != null) {
      addFrom(iEvent.getRule().getName());
    }
    return this;
  }

  public CustomDroolsEvent map(BeforeMatchFiredEvent iEvent) {
    setObject(iEvent.getMatch().getRule().getName());
    for (Object o : iEvent.getMatch().getObjects()) {
      addFrom(Integer.toString(o.hashCode()));
    }
    return this;
  }

  public CustomDroolsEvent map(Fact iFactType) {
    setObject(iFactType);
    return this;
  }

  public CustomDroolsEvent map(org.droolsfiddle.rest.Rule iRule) {
    setObject(iRule);
    return this;
  }


//  public String getJson() throws JsonProcessingException {
//    ObjectMapper mapper = new ObjectMapper();
//    return mapper.writeValueAsString(this);
//  }
}
