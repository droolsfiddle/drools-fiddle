package org.droolsfiddle.rest.model;

/**
 * Created by jvipret on 31/07/2016.
 */
public class RuleDTO {

  private String name;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  @Override
  public String toString() {
    return "RuleDTO{" +
            "name='" + name + '\'' +
            '}';
  }
}
