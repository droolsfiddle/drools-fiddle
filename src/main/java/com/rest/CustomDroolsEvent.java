package com.rest;

import org.kie.api.event.rule.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by jvipret on 23/07/2016.
 */
public class CustomDroolsEvent {

  private String action;
  private java.lang.Object object;
  private List<java.lang.Object> from;

  public CustomDroolsEvent(String action) {
    this.action = action;
    this.from = new ArrayList<Object>();
  }

  public String getAction() {
    return action;
  }

  public void setAction(String action) {
    this.action = action;
  }

  public Object getObject() {
    return object;
  }

  public void setObject(Object object) {
    this.object = object;
  }

  public List<Object> getFrom() {
    return from;
  }

  public void setFrom(List<Object> from) {
    this.from = from;
  }

  public void addFrom(Object from) {
    this.from.add(from);
  }

  public CustomDroolsEvent map(ObjectInsertedEvent iEvent) {
    setObject(iEvent.getObject());
    if (iEvent.getRule() != null) {
      addFrom(iEvent.getRule().getName());
    }
    return this;
  }

  public CustomDroolsEvent map(ObjectUpdatedEvent iEvent) {
    setObject(iEvent.getObject());
    if (iEvent.getRule() != null) {
      addFrom(iEvent.getRule().getName());
    }
    return this;
  }

  public CustomDroolsEvent map(ObjectDeletedEvent iEvent) {
    setObject(iEvent.getOldObject());
    if (iEvent.getRule() != null) {
      addFrom(iEvent.getRule().getName());
    }
    return this;
  }

  public CustomDroolsEvent map(BeforeMatchFiredEvent iEvent) {
    setObject(iEvent.getMatch().getRule().getName());
    setFrom(iEvent.getMatch().getObjects());
    return this;
  }

//  public String getJson() throws JsonProcessingException {
//    ObjectMapper mapper = new ObjectMapper();
//    return mapper.writeValueAsString(this);
//  }
}
