package com.rest;

/**
 * Created by jvipret on 08/06/2016.
 */
public class Message {

  private int id;
  private String data;

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public String getData() {
    return data;
  }

  public void setData(String data) {
    this.data = data;
  }

  @Override
  public String toString() {
    return "Message{" +
            "id=" + id +
            ", data='" + data + '\'' +
            '}';
  }
}
