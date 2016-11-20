package org.droolsfiddle.rest.model;

import java.util.List;

/**
 * Created by jvipret on 08/06/2016.
 */
public class PackageDTO {

  private int id;
  private String name;
  private List<FactDTO> factDTOs;

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

  public List<FactDTO> getFacts() {
    return factDTOs;
  }

  public void setFacts(List<FactDTO> factDTOs) {
    this.factDTOs = factDTOs;
  }

  @Override
  public String toString() {
    return "PackageDTO{" +
            "id=" + id +
            ", name='" + name + '\'' +
            ", factDTOs=" + factDTOs +
            '}';
  }
}
