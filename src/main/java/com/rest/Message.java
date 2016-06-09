package com.rest;

/**
 * Created by jvipret on 08/06/2016.
 */
public class Message {

  private int id;
  private String data;
  private String log;

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

  public String getLog() {
    return log;
  }

  public void setLog(String log) {
    this.log = log;
  }

  @Override
  public String toString() {
    return "Message{" +
            "id=" + id +
            ", data='" + data + '\'' +
            ", log='" + log + '\'' +
            '}';
  }
}
