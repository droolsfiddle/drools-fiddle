/*   Copyright 2016 Drools Fiddle

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

package org.droolsfiddle.rest.model;

import org.droolsfiddle.rest.JsonSchemaNode;
import org.droolsfiddle.rest.JsonSchemaNodeNew;

/**
 * Created by jvipret on 08/06/2016.
 */
public class Request {

  private int id;
  private String data;
  private String log;
  private String json; 
  private int nestingLimit; 
  private boolean success;
  private boolean hasLoop;
  // private List<PackageDTO> packages;
  private JsonSchemaNode jsonSchema;
  private JsonSchemaNodeNew jsonSchemaNew;
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
  
  public String getJson() {
    return json;
  }

  public void setJson(String json) {
    this.json = json;
  }
  
  public int getNestingLimit() {
	    return nestingLimit;
	  }

	  public void setNestingLimit(int nestingLimit) {
	    this.nestingLimit = nestingLimit;
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

  public JsonSchemaNodeNew getJsonSchemaNew() {
    return jsonSchemaNew;
  }

  public void setJsonSchemaNew(JsonSchemaNodeNew jsonSchemaNew) {
    this.jsonSchemaNew = jsonSchemaNew;
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
  
  public boolean isHasLoop() {
	  return hasLoop;
  }

  public void setHasLoop(boolean hasLoop) {
	  this.hasLoop = hasLoop;
  }


  @Override
  public String toString() {
    return "Request{" +
            "id=" + id +
            ", data='" + data + '\'' +
            ", log='" + log + '\'' +
            ", JSON='" + json + '\'' +
            ", success=" + success +
            ", jsonSchema=" + jsonSchema +
            '}';
  }

}
