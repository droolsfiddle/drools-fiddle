package com.rest;

/**
 * Created by jvipret on 08/06/2016.
 */
public class Attribute {

  private int id;
  private String name;
  private String type;

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

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  @Override
  public String toString() {
    return "Attribute{" +
            "id=" + id +
            ", name='" + name + '\'' +
            ", type='" + type + '\'' +
            '}';
  }
}
