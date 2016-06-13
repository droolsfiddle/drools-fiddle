package com.rest;

import java.util.List;

/**
 * Created by jvipret on 08/06/2016.
 */
public class Message {

  private int id;
  private String data;
  private String log;
  private List<Package> packages;


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

  public List<Package> getPackages() {
    return packages;
  }

  public void setPackages(List<Package> packages) {
    this.packages = packages;
  }

  @Override
  public String toString() {
    return "Message{" +
            "id=" + id +
            ", data='" + data + '\'' +
            ", log='" + log + '\'' +
            ", packages=" + packages +
            '}';
  }
}
