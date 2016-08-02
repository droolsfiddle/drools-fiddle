package org.droolsfiddle.rest;

/**
 * Created by jvipret on 31/07/2016.
 */
public class Rule {

  private String name;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  @Override
  public String toString() {
    return "Rule{" +
            "name='" + name + '\'' +
            '}';
  }
}
