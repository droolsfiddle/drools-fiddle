package org.droolsfiddle.rest.model;

import org.droolsfiddle.rest.JsonSchemaNode;

/**
 * Created by jvipret on 08/06/2016.
 */
public class Request {

  private int id;
  private String data;
  private String log;
  private boolean success;
  // private List<PackageDTO> packages;
  private JsonSchemaNode jsonSchema;
  // private Map<String,Object> jsonValue = new HashMap<>();


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

  // public List<PackageDTO> getPackages() {
  //  return packages;
  //}

  // public void setPackages(List<PackageDTO> packages) {
  //  this.packages = packages;
  // }

  public JsonSchemaNode getJsonSchema() {
    return jsonSchema;
  }

  public void setJsonSchema(JsonSchemaNode jsonSchema) {
    this.jsonSchema = jsonSchema;
  }

  // public Map<String, Object> getJsonValue() {
  //   return jsonValue;
  // }

  // public void setJsonValue(Map<String, Object> jsonValue) {
  //   this.jsonValue = jsonValue;
  // }


  public boolean isSuccess() {
    return success;
  }

  public void setSuccess(boolean success) {
    this.success = success;
  }

  @Override
  public String toString() {
    return "Request{" +
            "id=" + id +
            ", data='" + data + '\'' +
            ", log='" + log + '\'' +
            ", success=" + success +
            ", jsonSchema=" + jsonSchema +
            '}';
  }

}
