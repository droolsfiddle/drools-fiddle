package com.rest;

import java.util.List;

/**
 * Created by jvipret on 08/06/2016.
 */
public class Package {

  private int id;
  private String name;
  private List<Fact> facts;

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public List<Fact> getFacts() {
    return facts;
  }

  public void setFacts(List<Fact> facts) {
    this.facts = facts;
  }

  @Override
  public String toString() {
    return "Package{" +
            "id=" + id +
            ", name='" + name + '\'' +
            ", facts=" + facts +
            '}';
  }
}
