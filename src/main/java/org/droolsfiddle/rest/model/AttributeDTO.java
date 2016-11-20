package org.droolsfiddle.rest.model;

import java.util.Arrays;

/**
 * Created by jvipret on 08/06/2016.
 */
public class AttributeDTO {

  private int id;
  private String name;
  private String type;
  private Object[] enumValues;

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

  public Object[] getEnumValues() {
    return enumValues;
  }

  public void setEnumValues(Object[] enumValues) {
    this.enumValues = enumValues;
  }


  @Override
  public String toString() {
    return "AttributeDTO{" +
            "id=" + id +
            ", name='" + name + '\'' +
            ", type='" + type + '\'' +
            ", enumValues=" + Arrays.toString(enumValues) +
            '}';
  }
}
