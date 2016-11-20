package org.droolsfiddle.rest.model;

import java.util.List;

/**
 * Created by jvipret on 08/06/2016.
 */
public class FactDTO {

  private int id;
  private String name;
  private List<AttributeDTO> attributeDTOs;


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

  public List<AttributeDTO> getAttributes() {
    return attributeDTOs;
  }

  public void setAttributes(List<AttributeDTO> attributeDTOs) {
    this.attributeDTOs = attributeDTOs;
  }

  @Override
  public String toString() {
    return "FactDTO{" +
            "id=" + id +
            ", name='" + name + '\'' +
            ", attributes=" + attributeDTOs +
            '}';
  }
}
