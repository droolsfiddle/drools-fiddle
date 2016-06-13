package com.rest;

import java.util.List;

/**
 * Created by jvipret on 08/06/2016.
 */
public class Fact {

  private int id;
  private String name;
  private List<Attribute> attributes;


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

  public List<Attribute> getAttributes() {
    return attributes;
  }

  public void setAttributes(List<Attribute> attributes) {
    this.attributes = attributes;
  }

  @Override
  public String toString() {
    return "Fact{" +
            "id=" + id +
            ", name='" + name + '\'' +
            ", attributes=" + attributes +
            '}';
  }
}
