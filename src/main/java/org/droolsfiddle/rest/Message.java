package org.droolsfiddle.rest;

import java.lang.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by jvipret on 08/06/2016.
 */
public class Message {

  private int id;
  private String data;
  private String log;
  private List<Package> packages;
  private JsonSchemaNode jsonSchema;
  private Map<String,Object> jsonValue = new HashMap<>();


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

  public JsonSchemaNode getJsonSchema() {
    return jsonSchema;
  }

  public void setJsonSchema(JsonSchemaNode jsonSchema) {
    this.jsonSchema = jsonSchema;
  }

  public Map<String, Object> getJsonValue() {
    return jsonValue;
  }

  public void setJsonValue(Map<String, Object> jsonValue) {
    this.jsonValue = jsonValue;
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
