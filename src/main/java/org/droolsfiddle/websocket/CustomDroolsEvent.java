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

import org.droolsfiddle.rest.model.FactDTO;
import org.droolsfiddle.rest.model.RuleDTO;
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

  public CustomDroolsEvent map(FactDTO iFactType) {
    setObject(iFactType);
    return this;
  }

  public CustomDroolsEvent map(RuleDTO iRule) {
    setObject(iRule);
    return this;
  }


}
